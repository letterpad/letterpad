import dbConfig from "../../../../config/db.config";
import { Sequelize } from "sequelize-typescript";

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
export const connection = new Sequelize(
  config.database as string,
  config.username as string,
  config.password as string,
  {
    ...config,
    dialect: config.dialect || "sqlite",
  },
);
