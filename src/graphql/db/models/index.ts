import Author, { associateAuthor } from "./author";
import Media from "./media";
import Permission, { associatePermission } from "./permission";
import Post, { associatePost } from "./post";
import Role, { associateRole } from "./role";
import { Sequelize } from "sequelize";
import Setting from "./setting";
import Tags, { associateTags } from "./tags";
import dbConfig from "../../../../config/db.config";

enum envs {
  development = "development",
  test = "test",
  production = "production",
}

let env: envs = process.env.NODE_ENV
  ? envs[process.env.NODE_ENV as envs]
  : envs.development;

if (env === envs.development) env = envs.development;
if (env === envs.test) env = envs.test;

const config = dbConfig[env];
// establish  database connection
export const conn = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialect: config.dialect || "sqlite",
  },
);

export const modelsMap = {
  Tags: Tags(conn),
  Setting: Setting(conn),
  Media: Media(conn),
  Post: Post(conn),
  Author: Author(conn),
  Role: Role(conn),
  Permission: Permission(conn),
};

associateTags();
associatePost();
associateAuthor();
associateRole();
associatePermission();

const models = { Sequelize: Sequelize, sequelize: conn, ...modelsMap };

export default models;
