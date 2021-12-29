const path = require("path");

const getFile = (name) => {
  const dbFile = name + ".sqlite";
  return path.join(process.cwd(), "/data/", dbFile);
};

const dbConfig = {
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

module.exports = dbConfig;
