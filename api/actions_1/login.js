// export default function login(req) {
//   const user = {
//     name: req.body.name
//   };
//   req.session.user = user;
//   return Promise.resolve(user);
// }
var pool = require('../../config/mysql.config').pool;
export default function login(req) {
    return new Promise((resolve) => {
        pool.getConnection(function(err, connection) {

            connection.query("SELECT * FROM users WHERE email=? AND password=?",[req.body.email, req.body.password], function(err, rows) {
                if (err) throw err;
                connection.release();
                let user = {
                        logged_in: false
                    }
                if(rows.length > 0) {
                	user = {
					    name: rows[0].name,
					    email: req.body.email,
					    logged_in: true
				  	};
                }
                req.session.user = user;
                resolve(user);
            });

        });

    });
}