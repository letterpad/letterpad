const path = require("path");

export const getFile = name => {
  const dbFile = name + ".sqlite";
  return path.join(process.cwd(), "/data/", dbFile);
};

type IDbConfig = {
  development: any;
  test: any;
  production: any;
};
export const dbConfig: IDbConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
    storage: getFile("letterpad"),
    logging: false,
    define: {
      underscored: true,
      raw: true,
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
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
    dialect: process.env.DB_TYPE,
    storage: getFile("letterpad"),
    logging: false,
    define: {
      underscored: true,
    },
  },
};

export default dbConfig;
