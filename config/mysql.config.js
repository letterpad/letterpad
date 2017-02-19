var mysql      = require('mysql');
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
	debug: true
};
if(process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
	var pool = mysql.createPool(config);

}else{
	config.password = 'if1else2'
	var pool = mysql.createPool(config);
}


module.exports = {
	pool: pool,
	config: config
};