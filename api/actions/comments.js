var pool = require('../../config/mysql.config').pool;

export function getCommentsByPostId(req,params) {
    return new Promise((resolve,reject) => {
        getConnections('instagram')
        .then((connection) => {
            fetch(`https://api.instagram.com/v1/media/${params[0]}/comments/?access_token=${connection.access_token}`)
            .then((response) => {
                if(response.status >= 400) {
                    reject({
                        code: response.status,
                        msg: 'Server not responding'
                    })
                }
                return response.json();
            })
            .then((response) => {
                resolve(response.data)
            })
        })
        .catch(response => {
            reject(response)
        })
        
    });
}

function getConnections(network) {
    return new Promise((resolve) => {
        pool.getConnection(function(err, connection) {

            connection.query("SELECT * FROM connections WHERE network=?",network, function(err, rows) {
                if (err) throw err;
                connection.release();
                if(rows.length > 0) {
                    resolve(rows[0]);
                }else{
                    reject({
                        code: 401,
                        msg: 'No network found'
                    })
                }
            });

        });

    });
}