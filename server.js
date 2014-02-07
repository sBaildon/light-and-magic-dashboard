var express = require('express');
var app = express();

app.listen(80);

app.use('/libs', express.static(__dirname + '/libs'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

console.log('Server running');