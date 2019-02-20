var connection = require('./connect.js');

returnDatasets = function(callback) {
	connection.query('SELECT * FROM datasets WHERE end IS NULL', function(err, rows, fields) {
		callback(rows[0]);
	});
};

module.exports = returnDatasets;