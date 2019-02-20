var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	database: 'light',
	user: 'sean',
	password: 'mymysql'
});

connection.connect();

module.exports = connection;
