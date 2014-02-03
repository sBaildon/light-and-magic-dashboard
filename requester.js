var request = require('request');

var options = {
	url: 'https://api.xively.com/v2/feeds/34780663',
	method: 'GET',
	headers: {
		'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD'
	}
};

function response(error, res, body) {
	if (!error && res.statusCode == 200) {
		console.log('Query successful');
	} else if (res.statusCode == 401) {
		console.log('Incorrect authorisation, it\'s likely the API key has changed');
	} else {
		console.log('Not recognised');
	}
}

/* 
 * Setup Xively query rate. If seconds is not 0
 * it takes priority over minutes
 */
var intervalInMillis;
var intervalInSeconds = 0;
var intervalInMinutes = 1;

if (intervalInSeconds > 0) {
	intervalInMillis = intervalInSeconds * 1000;
} else if (intervalInMinutes > 0) {
	intervalInMillis = intervalInMinutes * 60000;
} else {
	intervalInMillis = 60000;
}

setInterval(function() { request(options, response); }, intervalInMillis);
