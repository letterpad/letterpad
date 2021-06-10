const env = require("node-env-file");
if (process.env.NODE_ENV === "production") {
  env(__dirname + "../../../../../.env.production.local");
} else {
  env(__dirname + "../../../../../.env.development.local");
}
const models = require("../models/index").default;
const { seed } = require("./seed");
const { Op } = require("sequelize");

// (async () => {
//   const post = await models.Post.findOne({ id: 2 });
//   // console.log("post :>> ", post);
//   const tags = await post.getTags({ raw: true });
//   console.log(tags.map(({ name, desc, slug }) => ({ name, desc, slug })));
// })();
seed(models)
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
