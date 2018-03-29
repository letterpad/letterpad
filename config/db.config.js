import Sequelize from "sequelize";
require("dotenv").config();
const DB_TYPE = process.env.DB_TYPE;
const DB_NAME = process.env.DB_NAME;
console.log(process.env.DB_TYPE);
let conn = null;
if (DB_TYPE === "sqlite") {
    conn = new Sequelize(DB_NAME, null, null, {
        dialect: "sqlite",
        storage: "./data/letterpad.sqlite",
        define: {
            underscored: true
        }
    });
}
/*-----------------------------------------------------------------------
 [ If you prefer to use mysql, then uncomment this configuration]
 [ Set .env with the right credentials]
 [ And install node-mysql, yarn add node-mysql ]

if (DB_TYPE === "mysql") {
    conn = new Sequelize(
        DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            // logging: str => {
            //     console.log(str);
            // },
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
}
*/

module.exports = {
    conn
};
