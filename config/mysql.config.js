var mysql      = require('mysql');
import Sequalize from 'sequelize';

var config = {
	host: '127.0.0.1',
	port: 3306,
	user: 'root',
	password: '123456',
	timezone: 'utc',
	charset : 'utf8mb4',
	connectionLimit: 30,
	database : 'reactcms',
	multipleStatements : true,
	debug: false
};
if(process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
	var pool = mysql.createPool(config);

}else{
	config.password = 'if1else2'
	var pool = mysql.createPool(config);
}

var conn = new Sequalize('reactcms', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
        underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = {
	pool: pool,
	conn: conn,
	config: config
};