var conn = require("../../../config/mysql.config").conn;
import sequelize from "sequelize";

export function doLogin(data) {
    return conn
        .query("SELECT * FROM authors WHERE username=?", {
            replacements: [data.username],
            type: sequelize.QueryTypes.SELECT
        })
        .then(function(user) {
            if (user.length === 1) {
                let result = { code: 200 };
                result.data = user[0];
                return result;
            }
            return {
                code: 403,
                msg: "Authentication failed"
            };
        });
}
