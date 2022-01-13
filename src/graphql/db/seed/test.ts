//@ts-nocheck
try {
  // this is required only in dev environment as we have import statements in dependency modules.
  // In production, this wont be required.
  require("@babel/polyfill");
  require("@babel/register")({
    plugins: ["@babel/plugin-syntax-dynamic-import"],
    presets: [["@babel/env"]],
  });
} catch (e) {
  //
}
const env = require("node-env-file");
console.log(__dirname + "../../../../.env.development.local");
env(__dirname + "/../../../../.env.development.local");
// const models = require("../models/index").default;
import models from "../models";
const { seed } = require("./seed");

(async () => {
  const post = await models.Post.findOne({ where: { id: 29 } });
  if (!post) return;
  const a = await post.getAuthor();
  console.log(a);
  // console.log(post.id);
  // await post.setTags([]);
  // await post.createTags({ slug: "hello", name: "hello" });
  // const Tags = await post.getTags();
  // console.log("post :>> ", Tags);
  // const author = await models.Author.findOne({ where: { id: 1 } });
  // if (author) {
  //   const role = await author.getRole();
  //   const perm = await role.getPermissions();
  //   perm.map(a => console.log(a.name));
  //   // console.log("author.social :>> ", author.social);
  // }

  // const s = await models.Setting.findOne({
  //   raw: true,
  //   where: { option: "menu" },
  // });

  // console.log("a :>> ", s.get());
})();

// seed(models).catch(e => {
//   console.error(e);
//   process.exit(1);
// });
