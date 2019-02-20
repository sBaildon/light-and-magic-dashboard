var connection = require('./connect.js');

returnDatasets = function(id, callback) {
	connection.query('update datasets set end=current_timestamp() where id="' + id + '"', function(err, rows, fields) {
		callback(rows);
	});
};

module.exports = returnDatasets;