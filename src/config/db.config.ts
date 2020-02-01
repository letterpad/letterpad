const path = require("path");

const getFile = name => {
  const dbFile = name + ".sqlite";
  return path.join(__dirname, "../../data/", dbFile);
};

export const dbConfig = {
  dev: {
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
