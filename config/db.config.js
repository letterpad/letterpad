import path from "path";
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
import Sequelize from "sequelize";
const DB_TYPE = process.env.DB_TYPE;
const DB_NAME = process.env.DB_NAME;

let conn = null;
if (DB_TYPE === "sqlite") {
    conn = new Sequelize(DB_NAME, null, null, {
        logging: process.env.NODE_ENV === "development",
        dialect: "sqlite",
        storage: `./data/${DB_NAME}.sqlite`,
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
