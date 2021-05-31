import { getSession } from "next-auth/client";
import { Author } from "./../../graphql/db/models/author";
import models from "@/graphql/db/models";
import multer from "multer";
import initMiddleware from "./middleware";
import { ROLES, SessionData } from "@/graphql/types";
import { Role } from "@/__generated__/type-defs.graphqls";
import { IAuthorData, IImportExportData } from "./importExportTypes";
import { insertRolePermData } from "@/graphql/db/seed/seed";
import { createAuthor } from "@/graphql/resolvers/author";
import jwt from "jsonwebtoken";

const upload = multer();
const multerAny = initMiddleware(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

const Import = async (req, res) => {
  await multerAny(req, res);
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session?.user?.email)
    return res.status(401).send({
      success: false,
      message: "No session found",
    });

  const data: IImportExportData = JSON.parse(req.files[0].buffer.toString());
  // const isLoggedInUserAuthor = session.user.role === Role.Author;
  const isLoggedInUserAdmin = session.user.role === Role.Admin;

  const adminEmail = "admin@admin.com";

  if (isLoggedInUserAdmin) {
    await models.sequelize.sync({ force: true });
    await insertRolePermData(models);
    await createAuthor({
      email: adminEmail,
      username: "admin",
      rolename: ROLES.ADMIN,
      site_title: "",
      verified: true,
      password: "admin",
      name: "Admin",
    });
  } else {
    if (Object.keys(data.authors).length > 1) {
      return res.status(401).send({
        success: false,
        message: "You are not allowed to import multiple authors",
      });
    }
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    if (!author) {
      return res.send({
        success: false,
        message: "This author does not exist",
      });
    }
  }

  const sanitizedData = sanitizeForeignData(data.authors);
  delete sanitizedData[adminEmail];
  const role = await models.Role.findOne({
    where: { name: ROLES.AUTHOR },
  });
  // none of the authors from here are admin
  for (const email in sanitizedData) {
    const authorsData = sanitizedData[email];
    let author = await models.Author.findOne({ where: { email } });
    if (!author && isLoggedInUserAdmin) {
      //@ts-ignore author
      const { id, role_id, setting_id, ...sanitizedAuthor } =
        authorsData["author"];
      author = await models.Author.create(sanitizedAuthor);
    }

    if (!author) {
      return res.send({
        success: false,
        message: `The author ${email} does not exist`,
      });
    }

    if (role) {
      author.setRole(role);
    }

    await removeUserData(author);

    authorsData.setting.client_token = jwt.sign(
      {
        id: author.id,
      },
      process.env.SECRET_KEY,
      {
        algorithm: "HS256",
      },
    );
    await author.createSetting(authorsData.setting);

    await Promise.all([
      ...authorsData.media.map(item => author?.createMedia(item)),
    ]);

    for (const data of authorsData.posts) {
      //@ts-ignore
      const { tags, ...post } = data;
      const newPost = await author.createPost({
        ...data,
        cover_image: data.cover_image,
      });

      for (const tag of tags) {
        const existingTag = await models.Tags.findOne({
          where: { name: tag.name, author_id: author.id },
        });
        if (existingTag) {
          newPost.addTag(existingTag);
        } else {
          const created = await author.createTag({ ...tag });
          if (created) newPost.addTag(created);
        }
      }
    }
  }

  return res.send({
    success: true,
    message: "Import complete",
  });
};

export default Import;

async function removeUserData(author: Author) {
  // remove setting
  await models.Setting.destroy({ where: { id: author.setting_id } });

  // remove tags
  await models.Tags.destroy({ where: { author_id: author.id } });

  // remove posts. also removes relationship with tags
  await models.Post.destroy({ where: { author_id: author.id } });

  // remove media
  await models.Media.destroy({ where: { author_id: author.id } });
}

function sanitizeForeignData(authors: IImportExportData["authors"]) {
  const sanitizedData: IImportExportData["authors"] = {};
  for (const email in authors) {
    const authorData: IAuthorData = authors[email];
    sanitizedData[email] = authorData;

    //posts
    const posts = authorData.posts.map(post => {
      // @ts-ignore
      const { id, author_id, ...rest } = post;
      return rest;
    });

    sanitizedData[email].posts = posts;

    // tags
    const tags = authorData.tags.map(tag => {
      // @ts-ignore
      const { id, author_id, ...rest } = tag;
      return rest;
    });

    sanitizedData[email].tags = tags;

    // settings
    // @ts-ignore
    const { id, ...setting } = authorData.setting;
    sanitizedData[email].setting = setting;

    // media
    const media = authorData.media.map(item => {
      // @ts-ignore
      const { id, author_id, ...rest } = item;
      return rest;
    });

    sanitizedData[email].media = media;
  }
  return sanitizedData;
}
