import Sequalize from "sequelize";

const DB_NAME = process.env.TEST_DB || process.env.MYSQL_DB;
const conn = new Sequalize(
    DB_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        // logging: str => {
        //     //console.log(str);
        // },
        logging: false,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
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
