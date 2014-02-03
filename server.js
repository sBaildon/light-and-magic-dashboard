var express = require('express');
var app = express();

app.use('/libs', express.static(__dirname + '/libs'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

require('./requester.js');
require('./js/socket.js');

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

io = require('socket.io').listen(app)

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


app.listen(80);
console.log('Server running');