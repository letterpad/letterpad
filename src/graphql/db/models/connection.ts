import dbConfig from "../../../../config/db.config";
/**
 * ! Import didnt work. During build, it would throw this error:
 * Attempted import error: 'Sequelize' is not exported from 'sequelize-typescript' (imported as 'Sequelize').
 */
const { Sequelize } = require("sequelize-typescript");

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
export const connection = new Sequelize({
  ...config,
  dialect: config.dialect || "sqlite",
});
