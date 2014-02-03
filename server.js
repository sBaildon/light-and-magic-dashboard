var express = require('express');
var app = express();

app.use('/libs', express.static(__dirname + '/libs'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

require('./requester.js');

app.get('/', function(req, res) {
	res.sendfile('index.html');
});


app.listen(80);
console.log('Server running');