import { getSession } from "next-auth/client";
import { Author } from "./../../graphql/db/models/author";
import models from "@/graphql/db/models";
import multer from "multer";
import initMiddleware from "./middleware";
import { getDateTime } from "../../../shared/utils";
import { SessionData } from "@/graphql/types";
import { Role } from "@/__generated__/type-defs.graphqls";
import { IAuthorData, IImportExportData } from "./importExportTypes";

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

  if (session.user.role === Role.Admin) {
    await removeAllDataAndImportCommons(data);
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
  console.log("sanitizedData :>> ", sanitizedData);
  for (const email in sanitizedData) {
    const authorsData = data.authors[email];
    const author = await models.Author.findOne({ where: { email } });
    console.log("author.id :>> ", author.id);
    if (!author) {
      return res.send({
        success: false,
        message: `The author ${email} does not exist`,
      });
    }
    await removeUserData(author);
    await author.createSetting(authorsData.setting);
    await Promise.all([
      ...authorsData.tags.map(tag => models.Tags.create(tag)),
    ]);
    await Promise.all([
      ...authorsData.media.map(item => models.Media.create(item)),
    ]);

    for (const data of authorsData.posts) {
      //@ts-ignore
      const { tags, ...post } = data;
      const newPost = await author.createPost({
        ...data,
        cover_image: data.cover_image,
      });

      for (const tag of tags) {
        await newPost.createTag({ ...tag });
      }
    }
  }

  return res.send({
    success: true,
    message: "Import complete",
  });
};

export default Import;

async function removeAllDataAndImportCommons(data: IImportExportData) {
  await models.sequelize.sync({ force: true });
  await Promise.all([
    ...data.common.permissions.map(permission =>
      models.Permission.create(permission),
    ),
  ]);
  await Promise.all([
    ...data.common.roles.map(role => models.Role.create(role)),
  ]);
  if (data.common.rolePermissions.length > 0) {
    await models.sequelize.query(
      `INSERT INTO rolePermissions (created_at, updated_at, role_id, permission_id) VALUES ${data.common.rolePermissions
        .map(() => "(?)")
        .join(",")};`,
      {
        replacements: data.common.rolePermissions.map(rp => {
          return [
            getDateTime(rp.created_at),
            getDateTime(rp.updated_at),
            rp.role_id,
            rp.permission_id,
          ];
        }),
        type: "INSERT",
      },
    );
  }
}

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
