import { getSession } from "next-auth/react";
import multer from "multer";
import initMiddleware from "./middleware";
import { ROLES, SessionData } from "@/graphql/types";
import { Role } from "@/__generated__/__types__";
import { IAuthorData, IImportExportData } from "./importExportTypes";

import { convertGhostToLetterpad } from "./importers/ghost/ghost";
import { prisma } from "@/lib/prisma";
import { getClientToken } from "@/shared/token";

const upload = multer();
const multerAny = initMiddleware(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

const Import = async (req, res) => {
  try {
    await multerAny(req, res);
    const _session = await getSession({ req });
    const session = _session as unknown as { user: SessionData };
    if (!session?.user?.email)
      return res.status(401).send({
        success: false,
        message: "No session found",
      });

    let data: IImportExportData = JSON.parse(req.files[0].buffer.toString());

    const importName = req.files[0].fieldname;
    if (importName === "ghost") {
      const ghostData = JSON.parse(req.files[0].buffer.toString());
      data = convertGhostToLetterpad(ghostData, session.user);
    }
    const isLoggedInUserAdmin = session.user.role === Role.Admin;

    if (!isLoggedInUserAdmin) {
      const author = await validateSingleAuthorImport(res, data, session.user);
      if (!author) {
        return res.send({
          success: false,
          message: "This author does not exist",
        });
      }
      // when importing from other cms, set the current password of the author
      if (data.authors[session.user.email].password === "") {
        data.authors[session.user.email].password = author.password;
      }
    }
    const response = await startImport(data.authors, isLoggedInUserAdmin);

    return res.send(response);
  } catch (e) {
    res.status(501).send({
      success: false,
      message: e.message,
    });
  }
};

export default Import;

async function startImport(data: { [email: string]: IAuthorData }, isAdmin) {
  const role = await prisma.role.findFirst({
    where: { name: ROLES.AUTHOR },
  });

  for (const email in data) {
    let author = await prisma.author.findFirst({
      where: { email },
    });

    if (isAdmin || author) {
      const { id, role_id, setting, ...authorsData } = data[email];
      //@ts-ignore
      const { author_id, ...filteredSetting } = setting;

      try {
        if (author) {
          await prisma.author.delete({ where: { email } });
        }
        author = await prisma.author.create({
          data: {
            name: authorsData.name,
            email: authorsData.email,
            bio: authorsData.bio,
            verified: true,
            username: authorsData.username,
            avatar: authorsData.avatar,
            password: authorsData.password,
            verify_attempt_left: 3,
            social: JSON.stringify(authorsData.social),
            role: {
              connect: {
                id: role?.id,
              },
            },
            subscribers: {
              create: [
                ...authorsData.subscribers.map(
                  ({ email, verified, verify_attempt_left }) => {
                    return { email, verified, verify_attempt_left };
                  },
                ),
              ],
            },
            setting: {
              create: {
                ...filteredSetting,
                id: undefined,
                client_token: getClientToken(authorsData.email),
              },
            },
            uploads: {
              create: [
                ...authorsData.uploads.map(({ name, url, width, height }) => {
                  return { name, url, width, height };
                }),
              ],
            },
            posts: {
              create: [
                ...authorsData.posts.map((post) => {
                  const { id, tags, author_id, ...rest } = post;
                  return {
                    ...rest,
                    createdAt: rest.createdAt
                      ? new Date(rest.createdAt)
                      : new Date(),
                    updatedAt: rest.updatedAt
                      ? new Date(rest.updatedAt)
                      : new Date(),
                    scheduledAt: rest.scheduledAt
                      ? new Date(rest.scheduledAt)
                      : new Date(),
                    tags: {
                      connectOrCreate: tags.map(({ name, slug }) => {
                        return {
                          create: { name, slug },
                          where: { name },
                        };
                      }),
                    },
                  };
                }),
              ],
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    }

    if (!author) {
      return {
        success: false,
        message: `The author ${email} does not exist`,
      };
    }

    return {
      success: true,
      message: "Import complete",
    };
  }
}

async function validateSingleAuthorImport(
  res,
  data: IImportExportData,
  sessionUser: SessionData,
) {
  if (Object.keys(data.authors).length > 1) {
    res.status(401).send({
      success: false,
      message: "You are not allowed to import multiple authors",
    });
    return null;
  }
  return prisma.author.findFirst({
    where: { id: sessionUser.id },
  });
}
