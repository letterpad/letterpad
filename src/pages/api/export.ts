import { IAuthorData, IImportExportData } from "./importExportTypes";
import { SessionData } from "./../../graphql/types";
import fs from "fs";
import { models } from "@/graphql/db/models";
import { Author } from "@/graphql/db/models/definations/author";
import { getSession } from "next-auth/react";
import { Role } from "@/__generated__/__types__";

const Export = async (req, res) => {
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session?.user?.email) return res.send("No session found");

  const data: IImportExportData = { authors: {} };
  let authors = await models.Author.findAll();
  const isAdmin = session.user.role === Role.Admin;

  if (!isAdmin) {
    authors = await models.Author.findAll({ where: { id: session.user.id } });
  }

  for (const author of authors) {
    data.authors[author.email] = await getContent(author as any);
  }

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");

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
  const setting = await author.$get("setting");
  // posts. we still need to add the tags to this.
  const posts = await author.$get("posts");

  const postWithTags: IAuthorData["posts"] = [];
  //posts with tags
  for (const post of posts) {
    const rawTags = await post.$get("tags", { raw: true });
    const tags = rawTags.map(({ name, desc, slug }) => ({
      name,
      desc,
      slug,
    }));

    // dataValues is to ignore adding all meta properties of model and to avoid
    // we cannot use .JSON() as that will execute getters.
    //@ts-ignore
    postWithTags.push({ ...post.dataValues, tags });
  }
  // tags
  const tags = await author.$get("tags", { raw: true });
  // media
  const media = await author.$get("uploads", { raw: true });
  const { id, ...settingWithoutId } = setting?.get();
  return {
    author,
    setting: settingWithoutId,
    tags,
    posts: postWithTags,
    media,
  };
}
