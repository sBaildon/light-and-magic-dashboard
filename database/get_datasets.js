var connection = require('./connect.js');

returnDatasets = function(callback) {
	connection.query('SELECT * FROM datasets', function(err, rows, fields) {
		callback(rows);
	});
};

module.exports = returnDatasets;