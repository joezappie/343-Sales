var databaseConfig = require("./config.json");
var mysql = require("mysql");

var pool;

module.exports = class Database {
	constructor() {
		this.createConnectionPool();
	}
	
	createConnectionPool() {
		// Create a new MYSQL pool to use if it doesnt exist
		if(!pool) {
			pool = mysql.createPool({
				connectionLimit : 10,
				host     : databaseConfig.mysqlConfig.host,
				user     : databaseConfig.mysqlConfig.user,
				password : databaseConfig.mysqlConfig.password,
				database : databaseConfig.mysqlConfig.database,
				debug    :  false
			});
		}
	}
	
	query(SQL, callback, res) {
		pool.query(SQL, function(err, rows, fields) {
			callback(err, rows, fields, res);
		});
	}
	
	/*select(parameters, callback) {
		var fields = "*";
		var tables = "";
		
		if('fields' in parameters) {
			fields = parameters.fields.join(",");
		}
		
		if('tables' in parameters) {
			fields = parameters.fields.join(",");
		}
		
		pool.query('SELECT * FROM orders', function(err, rows, fields) {
		  res.write("queried");
		  res.end();
		});
	}*/
}