var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);

app.use('/libs', express.static(__dirname + '/libs'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

require('./requester.js');

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

console.log('Server running');