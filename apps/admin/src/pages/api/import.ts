import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "@/lib/prisma";

import { validateWithAjv } from "@/components/import-export/schema";

import { Role } from "@/__generated__/__types__";
import { ROLES, SessionData } from "@/graphql/types";
import { encryptEmail } from "@/shared/clientToken";

import { convertGhostToLetterpad } from "./importers/ghost/ghost";
import initMiddleware from "./middleware";
import {
  IAuthorData,
  IImportExportData,
} from "../../components/import-export/importExportTypes";

const upload = multer();
const multerAny = initMiddleware(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

interface MulterRequest extends NextApiRequest {
  files: any;
}

const Import = async (req: MulterRequest, res: NextApiResponse) => {
  try {
    if (process.env.READ_ONLY) {
      res.status(200).send({
        success: false,
        message: "This is read only",
      });
    }
    await multerAny(req, res);
    const _session = await getSession({ req });
    const session = _session as unknown as { user: SessionData };
    if (!session?.user?.email)
      return res.status(401).send({
        success: false,
        message: "No session found",
      });
    const isAuthUserAdmin = session.user.role === Role.Admin;

    let foreignData = JSON.parse(req.files[0].buffer.toString());

    let passwords: Record<string, Record<string, string>> = {};
    const importName = req.files[0].fieldname;

    if (importName === "ghost") {
      const ghostData = JSON.parse(req.files[0].buffer.toString());
      foreignData = convertGhostToLetterpad(ghostData, session.user);
    } else {
      if (isAuthUserAdmin) {
        passwords = collectSensitiveFromData(foreignData.authors);
      }
    }

    let data: IImportExportData = foreignData;

    data = validateWithAjv(data);

    if (!isAuthUserAdmin) {
      data = validateWithAjv(data);
      const author = await validateSingleAuthorImport(res, data, session.user);
      if (!author) {
        throw new Error(
          "This author does not exist. You can only import your own."
        );
      }
    }
    const response = await startImport(
      data.authors,
      isAuthUserAdmin,
      session.user,
      passwords
    );

    return res.send(response);
  } catch (e: any) {
    res.status(200).send({
      success: false,
      message: e.message,
    });
  }
};

export default Import;

export async function startImport(
  data: { [email: string]: IAuthorData },
  isAdmin: boolean,
  session: SessionData,
  passwords: Record<string, Record<string, string>>
) {
  const role = await prisma.role.findFirst({
    where: { name: ROLES.AUTHOR },
  });

  for (const email in data) {
    if (!isAdmin && session.email !== email) {
      throw new Error("You can only import your own data");
    }
    let author = await prisma.author.findFirst({
      where: { email },
    });

    const { setting, ...authorsData } = data[email];
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
          occupation: authorsData.occupation,
          company_name: authorsData.company_name,
          password: isAdmin
            ? passwords[authorsData.email].password
            : author?.password ?? "",
          verify_attempt_left: 3,
          social: authorsData.social,
          role: {
            connect: {
              id: parseInt(passwords[authorsData.email]?.role_id ?? role?.id),
            },
          },
          subscribers: {
            create: [
              ...authorsData.subscribers.map(({ email, verified }) => {
                return { email, verified, verify_attempt_left: 3 };
              }),
            ],
          },
          setting: {
            create: {
              ...setting,
              client_token: encryptEmail(email),
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
                const { tags, ...rest } = post;
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
                    : null,
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
    } catch (e: any) {
      return {
        success: false,
        message: e.message,
      };
    }
  }

  return {
    success: true,
    message:
      "Your data has been imported successfully. You will be redirected to login again.",
  };
}

async function validateSingleAuthorImport(
  res,
  data: IImportExportData,
  sessionUser: SessionData
) {
  if (Object.keys(data.authors).length > 1) {
    res.status(200).send({
      success: false,
      message: "You are not allowed to import multiple authors",
    });
    return null;
  }
  return prisma.author.findFirst({
    where: { id: sessionUser.id },
  });
}

function collectSensitiveFromData(data: {
  [email: string]: IAuthorData & { password: string; role_id: number };
}) {
  const passwords = {};
  Object.keys(data).forEach((email) => {
    passwords[email] = {
      password: data[email].password,
      role_id: data[email].role_id,
    };
  });
  return passwords;
}
