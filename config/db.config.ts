// import { Dialect, Options } from "sequelize/types";

import path from "path";
import { SequelizeOptions } from "sequelize-typescript";

export const getFile = (name: string) => {
  const dbFile = name + ".sqlite";
  return path.join(process.cwd(), "/data/", dbFile);
};

type IDbConfig = {
  development: SequelizeOptions;
  test: SequelizeOptions;
  production: SequelizeOptions;
};
export const dbConfig: IDbConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE as SequelizeOptions["dialect"],
    storage: getFile("letterpad"),
    logging: false,
    define: {
      underscored: true,
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE as SequelizeOptions["dialect"],
    storage: getFile("test"),
    logging: false,
    define: {
      underscored: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE as SequelizeOptions["dialect"],
    storage: getFile("letterpad"),
    logging: false,
    define: {
      underscored: true,
    },
  },
};

export default dbConfig;
