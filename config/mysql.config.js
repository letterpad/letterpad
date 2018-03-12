import Sequalize from "sequelize";
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const conn = new Sequalize(
    DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        logging: str => {
            console.log(str);
        },
        logging: false,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        define: {
            underscored: true
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

module.exports = {
    conn
};
