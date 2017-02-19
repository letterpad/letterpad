var pool = require("../../../config/mysql.config").pool;

export function doLogin(data) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM users WHERE username=?", data.username, function(err, rows) {
                connection.release();
                if (err)
                    reject({
                        code: 500,
                        msg: "Internal query error"
                    });
                resolve({
                    code: 200,
                    msg: "",
                    data: rows && rows.length > 0 ? rows[0] : null
                });
            });
        });
    });
}