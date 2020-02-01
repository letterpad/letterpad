import Author from "./author";
import Media from "./media";
import Permission from "./permission";
import Post from "./post";
import PostTaxonomy from "./postTaxonomy";
import Role from "./role";
import { Sequelize } from "sequelize";
import Setting from "./setting";
import Taxonomy from "./taxonomy";
import Theme from "./theme";
// const { dbConfig } = require("../../config/db.config");
import dbConfig from "../../config/db.config";
const env = process.env.NODE_ENV || "dev";
const config = dbConfig[env];

// establish  database connection
const conn = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialect: config.dialect || "sqlite",
});

export const modelsMap = {
  Theme: Theme.init(conn),
  Taxonomy: Taxonomy.init(conn),
  Setting: Setting.init(conn),
  PostTaxonomy: PostTaxonomy.init(conn),
  Media: Media.init(conn),
  Post: Post.init(conn),
  Author: Author.init(conn),
  Role: Role.init(conn),
  Permission: Permission.init(conn),
};
const models = { Sequelize: Sequelize, sequelize: conn, ...modelsMap };
// now that we have the model instances, add relationships
// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(modelsMap)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

export default models;
