const env = require("node-env-file");
env(__dirname + "/../../../.env");

const path = require("path");

const configs = getConfigs();
let config;

if (Object.keys(configs).includes(process.env.NODE_ENV)) {
  config = configs[process.env.NODE_ENV];
} else {
  config = configs.dev;
}
console.log("This file was called from housekeeper");
module.exports = config;

//! This part is duplicated. This already exist in src/config/dbConfig.ts.
//! But I am not able to import it here.
function getConfigs() {
  const getFile = name => {
    const dbFile = name + ".sqlite";
    return path.join(__dirname, "../../data/", dbFile);
  };

  const configs = {
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

  return configs;
}
