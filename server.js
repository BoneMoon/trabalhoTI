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
        socket,
        playing: false,
    };

    lista.push(players[socket.id]);

    if (lista.length < 2) {
        io.emit("espera");
    }

    if (lista.length == 2) {
        for (const p of lista) {
            p.playing = true;
        }
        io.emit("ready");
    }

    // send the players object to the new player
    socket.emit(
        "currentPlayers",
        Object.entries(players).reduce(function (acc, curr) {
            return { ...acc, [curr[0]]: { ...curr[1], socket: undefined } };
        }, {})
    );

    // update all other players of the new player
    socket.broadcast.emit("newPlayer", {
        ...players[socket.id],
        socket: undefined,
    });

    if (lista.length > 2) {
        socket.emit("lotado");
    }

    socket.on("disconnect", function () {
        console.log("a user disconnected", socket.id);

        lista = lista.filter((player) => player.playerId !== socket.id);

        delete players[socket.id];

        for (const p of lista) {
            if (p.playing) {
                p.socket.emit("gameOver", socket.id);
            }
        }

        //console.log(lista, players);

        //io.emit("disconnect", socket.id);
    });

    socket.on("exit", function () {
        socket.disconnect();
    });

    socket.on("playerMovement", function (movementData) {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;

            socket.broadcast.emit("playerMoved", {
                ...players[socket.id],
                socket: undefined,
            });
        }
    });

    socket.on("tempoFinal", function (timer) {
        players[socket.id].tempo = timer;
        listaTempo.push({ time: players[socket.id].tempo, socket });

        console.log(listaTempo);

        if (listaTempo.length >= 2) {
            if (listaTempo[0].time < listaTempo[1].time) {
                listaTempo[0].socket.emit("youWin");
                listaTempo[1].socket.emit("youLose");
                listaTempo = [];
            } else if (listaTempo[1].time < listaTempo[0].time) {
                listaTempo[1].socket.emit("youWin");
                listaTempo[0].socket.emit("youLose");
                listaTempo = [];
            } else {
                console.log("asdasd");
            }
        }
    });
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});
