import { SessionData } from "./../../graphql/types";
import fs from "fs";
import models from "@/graphql/db/models";
import { Author } from "@/graphql/db/models/author";
import { getSession } from "next-auth/client";
import { Role } from "@/__generated__/type-defs.graphqls";

const Export = async (req, res) => {
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session?.user?.email) return res.send("No session found");

  const data: any = { common: {}, authors: {} };
  let authors = await models.Author.findAll();

  if (session.user.role !== Role.Admin) {
    authors = await models.Author.findAll({ where: { id: session.user.id } });
  } else {
    data.common.permissions = await models.Permission.findAll();
    data.common.roles = await models.Role.findAll();
    const [rolePermissions] = await models.sequelize.query(
      `SELECT * FROM rolePermissions`,
    );
    data.common.rolePermissions = rolePermissions;
  }

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

export default Export;

async function getContent(author: Author) {
  // settings
  const setting = await author.getSetting({ raw: true });
  // posts
  const posts = await author.getPosts({ raw: true });
  // tags
  const tags = await author.getTags({ raw: true });
  // media
  const media = await author.getMedia({ raw: true });
  // postTagsRelation
  const [postTags] = await models.sequelize.query(
    `SELECT * FROM postTags WHERE post_id IN (${posts
      .map(p => p.id)
      .join(",")})`,
  );

  return { author, setting, tags, posts, media, postTags };
}
