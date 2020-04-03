var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

var tempo = 0;

var i = 1;
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket){

  /*
    const connections = [null, null];

    // Handle a socket connection request from web client
    io.on('connection', function (socket) {
      
      // Find an available player number
      let playerIndex = -1;
      for (var i in connections) {
        if (connections[i] === null) {
          playerIndex = i;
        }
      }
      
      // Tell the connecting client what player number they are
      socket.emit('player-number', playerIndex);
      
      // Ignore player 3
      if (playerIndex == -1) return;
      
      connections[playerIndex] = socket;
      
      // Tell everyone else what player number just connected
      socket.broadcast.emit('player-connect', playerIndex);
    });
  */

  console.log('a user connected', socket.id);

  // create a new player and add it to our players object
  players[socket.id] = {
    x: /*30*/Math.floor(Math.random() * 70),
    y: 400,
    playerId: socket.id,
    i: i++
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);

  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  console.log(players[socket.id].i);

  socket.on('disconnect', function () {
    console.log('a user disconnected', socket.id);

    delete players[socket.id];

    io.emit('disconnect', socket.id)
  });

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});