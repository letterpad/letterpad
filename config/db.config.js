var env = require("node-env-file");
env(__dirname + "/../.env");
var path = require("path");
var sequelize = require("sequelize");
var DB_TYPE = process.env.DB_TYPE;
var DB_NAME = process.env.DB_NAME;

var conn = null;
if (DB_TYPE === "sqlite") {
    conn = new sequelize(DB_NAME, null, null, {
        logging: process.env.NODE_ENV === "development",
        dialect: "sqlite",
        storage: "./data/" + DB_NAME + ".sqlite",
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
    conn: conn
};
