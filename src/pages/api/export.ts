import fs from "fs";
import models from "@/graphql/db/models";
import { Author } from "@/graphql/db/models/author";

const ImportExport = async (req, res) => {
  const authors = await models.Author.findAll();

  const data: any = { common: {}, authors: {} };

  data.common.permissions = await models.Permission.findAll();
  data.common.roles = await models.Role.findAll();

  for (const author of authors) {
    data.authors[author.email] = await getContent(author);
  }

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

  const stat = fs.statSync("data.json");

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename=\"data.json\"`,
  });

  const readStream = fs.createReadStream("data.json");
  readStream.pipe(res);
};

export default ImportExport;

async function getContent(author: Author) {
  // settings
  const setting = await author.getSetting();
  // posts
  const posts = await author.getPosts();
  // tags
  const tags = await author.getTags();
  // media
  const media = await author.getMedia();
  // postTagsRelation
  const [postTags] = await models.sequelize.query(
    `SELECT * FROM postTags WHERE post_id IN (${posts
      .map(p => p.id)
      .join(",")})`,
  );

  return { author, setting, tags, posts, media, postTags };
}
