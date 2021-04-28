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
env(__dirname + "../../../../../.env.development.local");
const models = require("../models/index").default;
const { seed } = require("./seed");

(async () => {
  const author = await models.Author.findOne({ where: { id: 1 } });
  console.log("author :>> ", author);
  const tag = await author.createTag({ name: "wow", slug: "wow" });
  console.log(tag);
  // console.log(hasTag);
})();

seed(models)
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
