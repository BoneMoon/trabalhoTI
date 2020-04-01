var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket){
  console.log('a user connected', socket.id);

  // create a new player and add it to our players object
  players[socket.id] = {
    x: /*30*/Math.floor(Math.random() * 70),
    y: 400,
    playerId: socket.id
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);

  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('a user disconnected', socket.id);

    delete players[socket.id];

    io.emit('disconnect', socket.id)
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});