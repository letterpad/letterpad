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
                return user[0];
            }
            throw new Error({
                code: 403,
                msg: "Authentication failed"
            });
        })
        .then(author => {
            return conn
                .query(
                    "SELECT p.name as permission,r.name as role FROM permissions p INNER JOIN role_per_relation rpr ON rpr.permission_id = p.id INNER JOIN roles r ON r.id = rpr.role_id WHERE r.id = ?",
                    {
                        replacements: [author.role_id],
                        type: sequelize.QueryTypes.SELECT
                    }
                )
                .then(result => {
                    let data = { role: "", permissions: [] };
                    result.map(record => {
                        data.role = record.role;
                        data.permissions.push(record.permission);
                    });
                    author.role = data;
                    let out = { code: 200 };
                    out.data = author;
                    return out;
                });
        })
        .catch(error => {
            return error;
        });
}
