import Sequalize from "sequelize";

const mysql = require("mysql");

const db = process.env.TEST_DB || "reactcms";

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    timezone: "utc",
    charset: "utf8mb4",
    connectionLimit: 30,
    database: db,
    multipleStatements: true,
    debug: false
};
let pool = mysql.createPool(config);

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "dev") {
    config.password = "";
    pool = mysql.createPool(config);
}

const conn = new Sequalize(db, "root", "123456", {
    logging: str => {
        console.log(str);
    },
    host: "localhost",
    dialect: "mysql",
    define: {
        underscored: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = {
    pool,
    conn,
    config
};
