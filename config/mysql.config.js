import Sequalize from "sequelize";

const DB_NAME = process.env.TEST_DB || process.env.MYSQL_DB;

const conn = new Sequalize(
    DB_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        logging: str => {
            //...
        },
        host: process.env.MYSQL_HOST,
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
