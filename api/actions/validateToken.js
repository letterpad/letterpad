var pool = require('../../config/mysql.config').pool;
export default function validateToken(token) {
    return new Promise((resolve,reject) => {
        pool.getConnection(function(err, connection) {

            connection.query("SELECT * FROM users WHERE token=?",token, function(err, rows) {
                if (err) throw err;
                connection.release();
                if(rows.length > 0) {
                    resolve();
                }else{
                    reject();
                }
            });

        });

    });
}