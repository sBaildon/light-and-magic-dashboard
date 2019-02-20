var connection = require('./connect.js');

returnDatasets = function(id, callback) {
	connection.query('insert into datasets values ("' + id + '", current_timestamp(), NULL)', function(err, rows, fields) {
		callback(rows);
	});
};

module.exports = returnDatasets;