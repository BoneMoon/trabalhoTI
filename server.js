var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};

var i = 1;
var lista = [];
var listaTempo = [];
var tempo = 0;

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
    console.log("a user connected", socket.id);

    // create a new player and add it to our players object
    players[socket.id] = {
        x: /*30*/ Math.floor(Math.random() * 70),
        y: 400,
        playerId: socket.id,
        i: i++,
        tempo,
    };

    //console.log(players[socket.id].i);

    lista.push(players[socket.id]);
    //console.log(lista);
    /*
    if (lista.length < 2) {
        socket.emit("espera");
    }

    if (lista.length == 2) {
        socket.emit("ready");
        
        // send the players object to the new player
        socket.emit("currentPlayers", players);

        // update all other players of the new player
        socket.broadcast.emit("newPlayer", players[socket.id]);
        
    }

    if (lista.length > 2) {
        socket.emit("lotado");
    }

*/
    // send the players object to the new player
    socket.emit("currentPlayers", players);

    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("disconnect", function () {
        console.log("a user disconnected", socket.id);
        i--;

        lista.length--;
        //console.log(lista);
        delete players[socket.id];

        io.emit("disconnect", socket.id);
    });

    socket.on("playerMovement", function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;

        socket.broadcast.emit("playerMoved", players[socket.id]);
    });

    socket.on("tempoFinal", function (timer) {
        players[socket.id].tempo = timer;
        listaTempo.push(players[socket.id].tempo);

        console.log(listaTempo);

        if (listaTempo[0] < listaTempo[1] || listaTempo[1] < listaTempo[0]) {
            console.log("Ganhou");
            socket.emit("youWin");
        }
        if (listaTempo[1] > listaTempo[0] || listaTempo[0] > listaTempo[1]) {
            console.log("Perdeu");
            socket.emit("youLose");
        }
    });
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});
