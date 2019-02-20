var connection = require('./connect.js');

returnDatasets = function(callback) {
	connection.query('SELECT * FROM datasets WHERE end IS NOT NULL', function(err, rows, fields) {
		callback(rows);
	});
};

module.exports = returnDatasets;