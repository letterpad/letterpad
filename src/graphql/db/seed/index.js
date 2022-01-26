const env = require("node-env-file");
if (process.env.NODE_ENV === "production") {
  env(__dirname + "../../../../../.env.production.local");
} else {
  env(__dirname + "../../../../../.env.development.local");
}
// const connection = require("../models/index2").default;
const { seed } = require("./seed");
const { Op } = require("sequelize");

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
