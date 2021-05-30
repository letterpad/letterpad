import { IAuthorData } from "./importExportTypes";
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

  const data: any = { authors: {} };
  let authors = await models.Author.findAll();
  const isAdmin = session.user.role === Role.Admin;

  if (!isAdmin) {
    authors = await models.Author.findAll({ where: { id: session.user.id } });
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

async function getContent(author: Author): Promise<IAuthorData> {
  // settings
  const setting = await author.getSetting({ raw: true });
  // posts. we still need to add the tags to this.
  const posts = await author.getPosts();

  const postWithTags: IAuthorData["posts"] = [];
  //posts with tags
  for (const post of posts) {
    const rawTags = await post.getTags({ raw: true });
    const tags = rawTags.map(({ name, desc, slug }) => ({
      name,
      desc,
      slug,
    }));
    postWithTags.push({ ...post.get(), tags });
  }
  // tags
  const tags = await author.getTags({ raw: true });
  // media
  const media = await author.getMedia({ raw: true });

  return { author, setting, tags, posts: postWithTags, media };
}
