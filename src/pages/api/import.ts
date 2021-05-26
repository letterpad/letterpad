import { AuthorAttributes } from "./../../graphql/db/models/author";
import { RoleAttributes } from "./../../graphql/db/models/role";
import { PermissionAttributes } from "./../../graphql/db/models/permission";
import { MediaAttributes } from "./../../graphql/db/models/media";
import { SettingAttributes } from "./../../graphql/db/models/setting";
import models from "@/graphql/db/models";
import multer from "multer";
import initMiddleware from "./middleware";
import { PostAttributes } from "@/graphql/db/models/post";
import { TagsAttributes } from "@/graphql/db/models/tags";

const upload = multer();
const multerAny = initMiddleware(upload.any());

export const config = {
  api: {
    bodyParser: false,
  },
};

interface PostTags {
  created_at: string;
  updated_at: string;
  post_id: number;
  tag_id: number;
}

interface IImport {
  common: {
    roles: RoleAttributes[];
    permissions: PermissionAttributes[];
  };
  authors: {
    [email: string]: {
      posts: PostAttributes[];
      settings: SettingAttributes;
      tags: TagsAttributes[];
      media: MediaAttributes[];
      author: AuthorAttributes;
      postTags: PostTags[];
    };
  };
}

const ImportExport = async (req, res) => {
  await multerAny(req, res);
  const data: IImport = JSON.parse(req.files[0].buffer.toString());
  await models.sequelize.sync({ force: true });

  await Promise.all([
    ...data.common.permissions.map(permission =>
      models.Permission.create(permission),
    ),
  ]);
  await Promise.all([
    ...data.common.roles.map(role => models.Role.create(role)),
  ]);

  for (const email in data.authors) {
    const authorsData = data.authors[email];
    await models.Setting.create(authorsData.settings);
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
          cover_image: JSON.stringify(post.cover_image),
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
            return [tag.created_at, tag.updated_at, tag.tag_id, tag.post_id];
          }),
          type: "INSERT",
        },
      );
    }
  }

  res.end("Import complete");
};

export default ImportExport;
