import { getSession } from "next-auth/client";
import { Author, AuthorAttributes } from "./../../graphql/db/models/author";
import { RoleAttributes } from "./../../graphql/db/models/role";
import { PermissionAttributes } from "./../../graphql/db/models/permission";
import { MediaAttributes } from "./../../graphql/db/models/media";
import { SettingAttributes } from "./../../graphql/db/models/setting";
import models from "@/graphql/db/models";
import multer from "multer";
import initMiddleware from "./middleware";
import { PostAttributes } from "@/graphql/db/models/post";
import { TagsAttributes } from "@/graphql/db/models/tags";
import { getDateTime } from "../../../shared/utils";
import { SessionData } from "@/graphql/types";
import { Role } from "@/__generated__/type-defs.graphqls";

const upload = multer();
const multerAny = initMiddleware(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

interface PostTags {
  created_at: Date;
  updated_at: Date;
  post_id: number;
  tag_id: number;
}

interface RolePermissions {
  created_at: Date;
  updated_at: Date;
  role_id: number;
  permission_id: number;
}

interface IAuthorData {
  posts: PostAttributes[];
  setting: SettingAttributes;
  tags: TagsAttributes[];
  media: MediaAttributes[];
  author: AuthorAttributes;
  postTags: PostTags[];
}
interface IImport {
  common: {
    roles: RoleAttributes[];
    permissions: PermissionAttributes[];
    rolePermissions: RolePermissions[];
  };
  authors: {
    [email: string]: IAuthorData;
  };
}

const Import = async (req, res) => {
  await multerAny(req, res);
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session?.user?.email)
    return res.status(401).send({
      success: false,
      message: "No session found",
    });

  const data: IImport = JSON.parse(req.files[0].buffer.toString());

  if (session.user.role === Role.Admin) {
    await removeAllDataAndImport(data);
  } else {
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    if (!author) {
      return res.send({
        success: false,
        message: "This author does not exist",
      });
    }
    const hasErrors = validate(author, data.authors[session.user.email]);
    if (hasErrors.length > 0) {
      return res.send({
        success: false,
        message: hasErrors[0],
      });
    }
    await removeUserDataAndImport(author, data.authors[session.user.email]);
  }

  for (const email in data.authors) {
    const authorsData = data.authors[email];
    await models.Setting.create(authorsData.setting);
    await models.Author.create(authorsData.author);
    await Promise.all([
      ...authorsData.tags.map(tag => models.Tags.create(tag)),
    ]);
    await Promise.all([
      ...authorsData.media.map(item => models.Media.create(item)),
    ]);

    await Promise.all([
      ...authorsData.posts.map(post =>
        models.Post.create({
          ...post,
          cover_image: post.cover_image,
        }),
      ),
    ]);

    if (authorsData.postTags.length > 0) {
      await models.sequelize.query(
        `INSERT INTO postTags (created_at, updated_at, tag_id, post_id) VALUES ${authorsData.postTags
          .map(() => "(?)")
          .join(",")};`,
        {
          replacements: authorsData.postTags.map(tag => {
            return [
              getDateTime(tag.created_at),
              getDateTime(tag.updated_at),
              tag.tag_id,
              tag.post_id,
            ];
          }),
          type: "INSERT",
        },
      );
    }
  }

  return res.send({
    success: true,
    message: "Import complete",
  });
};

export default Import;

async function removeAllDataAndImport(data: IImport) {
  await models.sequelize.sync({ force: true });
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
  await Promise.all([
    ...data.common.permissions.map(permission =>
      models.Permission.create(permission),
    ),
  ]);
  await Promise.all([
    ...data.common.roles.map(role => models.Role.create(role)),
  ]);
}

async function removeUserDataAndImport(author: Author, data: IAuthorData) {
  // remove author
  await models.Author.destroy({ where: { id: data.author.id } });

  // remove setting
  await models.Setting.destroy({ where: { id: author.setting_id } });

  // remove tags
  await models.Tags.destroy({ where: { author_id: data.author.id } });

  // remove posts. also removes relationship with tags
  await models.Post.destroy({ where: { author_id: data.author.id } });

  // remove media
  await models.Media.destroy({ where: { author_id: data.author.id } });
}

function validate(author: Author, data: IAuthorData): string[] {
  //@ts-ignore - setting_id and role_id are relational attributes
  const { email, id, setting_id, role_id } = author;

  const postIds = data.posts.map(post => post.id);
  const tagIds = data.tags.map(tag => tag.id);

  let errors = data.posts.reduce((err: string[], post) => {
    const isValid = post.author_id == id;
    if (!isValid) {
      err.push("Invalid author id in posts");
    }
    return err;
  }, []);

  if (errors.length > 0) {
    return errors;
  }

  errors = data.media.reduce((err: string[], item) => {
    const isValid = item.author_id == id;
    if (!isValid) {
      err.push("Invalid author id in media");
    }
    return err;
  }, []);

  if (errors.length > 0) {
    return errors;
  }

  errors = data.tags.reduce((err: string[], tag) => {
    const isTrue = tag.author_id == id;
    if (!isTrue) {
      err.push("Invalid author id in tags");
    }
    return err;
  }, []);

  if (errors.length > 0) {
    return errors;
  }

  const validSetting = data.setting.id === setting_id;

  if (!validSetting) {
    return ["Invalid setting id"];
  }

  const validAuthor =
    data.author.id === id &&
    data.author.role_id === role_id &&
    data.author.setting_id === setting_id &&
    data.author.email === email;

  if (!validAuthor) {
    return ["Invalid author data"];
  }

  errors = data.postTags.reduce((err: string[], item) => {
    const isValid =
      postIds.includes(item.post_id) && tagIds.includes(item.tag_id);
    if (!isValid) {
      err.push("Invalid post and tags relation");
    }
    return err;
  }, []);

  return errors;
}
