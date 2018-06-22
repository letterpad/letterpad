const path = require("path");
const dbFile = (process.env.DB_NAME ? process.env.DB_NAME : "test") + ".sqlite";
const dbFilepath = path.join(__dirname, "../data/", dbFile);
module.exports = {
    dev: {
        username: "root",
        password: null,
        database: process.env.DB_NAME,
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: dbFilepath,
        logging: false,
        define: {
            underscored: true
        }
    },
    test: {
        username: "root",
        password: null,
        database: "test",
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: dbFilepath,
        logging: false,
        define: {
            underscored: true
        }
    },
    production: {
        username: "root",
        password: null,
        database: process.env.DB_NAME,
        host: "127.0.0.1",
        dialect: "sqlite",
        storage: dbFilepath,
        logging: false,
        define: {
            underscored: true
        }
    }
};
