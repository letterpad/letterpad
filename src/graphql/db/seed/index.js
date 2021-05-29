const env = require("node-env-file");
env(__dirname + "../../../../../.env.development.local");
const models = require("../models/index").default;
const { seed } = require("./seed");
const { Op } = require("sequelize");

seed(models)
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
