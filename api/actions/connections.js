var pool = require('../../config/mysql.config').pool;
import { validateToken } from './validateToken'

import moment from 'moment'

export function getConnections(req,params) {
    
    return new Promise((resolve) => {
        pool.getConnection(function(err, connection) {

            connection.query("SELECT * FROM connections", function(err, rows) {
                if (err) throw err;
                connection.release();
                resolve(rows);
            });

        });

    });
}

export function getConnectionByName(req, params) {
    
    return new Promise((resolve,reject) => {

        if(params.length !== 1) {
            reject({
                code: 500,
                msg: 'Missing connection parameter',
                data: {}
            })
            return;
        }
        pool.getConnection(function(err, connection) {

            connection.query("SELECT * FROM connections WHERE network=?",params[0], function(err, rows) {
                if (err) throw err;
                connection.release();
                let data = (rows.length > 0) ? rows[0] : {}
                resolve({
                    code: 200,
                    data: data
                });
            });

        });

    });
}

export function insertConnection(data) {

    return new Promise((resolve) => {
        pool.getConnection(function(err, connection) {

            var msg = {
                access_token: data.access_token,
                network: data.network,
                username: data.user.username,
                user_id: data.user.id,
                user: JSON.stringify(data.user),
                created_on: moment.utc().format('YYYY-MM-DD HH:mm:ss')
            };
            //insert the message
            connection.query("INSERT INTO connections SET ?", msg, function(err, rows) {
                if (err) throw err;
                connection.release()
                console.log('200 reached');
                resolve({
                    code: 200
                });
            });

        });

    });
}