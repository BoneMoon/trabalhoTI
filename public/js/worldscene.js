var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function WorldScene() {
        Phaser.Scene.call(this, { key: "WorldScene" });
    },

    preload: function () {},

    create: function () {
        var self = this;
        this.jogo = 0;

        this.socket = io();

        this.tempoText = this.add.text(16, 16, "", {
            fontSize: "32px",
            fill: "#000000",
        });
        this.timeOut = performance.now();
        this.timer = 0;

        this.socket.on("ready", function () {
            self.start();
        });

        this.socket.on("espera", function () {
            self.wait();
        });

        this.socket.on("currentPlayers", function (players) {
            console.log("Currr");
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    self.addPlayer(self, players[id]);
                } else {
                    self.addOtherPlayers(self, players[id]);
                }
            });
        });

        this.socket.on("newPlayer", function (playerInfo) {
            console.log("newPlayer");
            self.addOtherPlayers(self, playerInfo);
        });

        this.socket.on("disconnect", function (playerId) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        this.socket.on("youWin", function () {
            self.scene.start("youWin");
            this.socket.disconnect();
        });
        this.socket.on("youLose", function () {
            self.scene.start("youLose");
            this.socket.disconnect();
        });

        this.espera = this.add.text(50, 50, "", {
            fontSize: "32px",
            fill: "#000000",
        });

        /*this.lotado = this.add.text(50, 50, "", {
            fontSize: "32px",
            fill: "#000000",
        });*/

        this.direita = false;
        this.esquerda = false;
        this.cima = false;

        // tilesets
        const map = this.make.tilemap({ key: "mapas" });
        const chao = map.addTilesetImage("chao", "chao");
        const porta = map.addTilesetImage("lava_porta", "porta");
        const lava = map.addTilesetImage("lava_porta", "lava");
        const espinhos = map.addTilesetImage("espinhos", "espinhos");

        // layers
        this.mapa = map.createStaticLayer("chao", chao, 0, 0);
        this.obj = map.createStaticLayer("porta", porta, 0, 0);
        this.danoLava = map.createStaticLayer("lava", lava, 0, 0);
        this.danoEsp = map.createStaticLayer("espinhos", espinhos, 0, 0);

        // colisões com as layers
        this.mapa.setCollisionByExclusion(-1, true);
        this.danoLava.setCollisionByExclusion(-1, true);
        this.danoEsp.setCollisionByExclusion(-1, true);
        this.obj.setCollisionByExclusion(-1, true);

        // -- adionar botão direito
        this.btndir = this.add.image(300, 500, "btndir").setInteractive();
        this.btndir.setScale(0.2);
        this.btndir.setScrollFactor(0);

        this.btndir.on(
            "pointerover",
            function () {
                this.direita = true;
            },

            this
        );
        this.btndir.on(
            "pointerdown",
            function () {
                this.direita = true;
            },
            this
        );

        this.btndir.on(
            "pointerout",
            function () {
                this.direita = false;
            },

            this
        );

        this.btndir.emit("pointerover");
        this.btndir.emit("pointerdown");
        this.btndir.emit("pointerout");

        // -- adicionar botão esquerdo
        this.btnesq = this.add.image(100, 500, "btnesq").setInteractive();
        this.btnesq.setScale(0.2);
        this.btnesq.setScrollFactor(0);

        this.btnesq.on(
            "pointerover",
            function () {
                this.esquerda = true;
            },

            this
        );
        this.btnesq.on(
            "pointerdown",
            function () {
                this.esquerda = true;
            },
            this
        );

        this.btnesq.on(
            "pointerout",
            function () {
                this.esquerda = false;
            },

            this
        );

        this.btnesq.emit("pointerover");
        this.btnesq.emit("pointerdown");
        this.btnesq.emit("pointerout");

        // -- adicionar botão para cima
        this.btnup = this.add.image(200, 400, "btnup").setInteractive();
        this.btnup.setScale(0.2);
        this.btnup.setScrollFactor(0);

        this.btnup.on(
            "pointerover",
            function () {
                this.cima = true;
            },

            this
        );
        this.btnup.on(
            "pointerdown",
            function () {
                this.cima = true;
            },
            this
        );

        this.btnup.on(
            "pointerout",
            function () {
                this.cima = false;
            },

            this
        );

        this.btnup.emit("pointerover");
        this.btnup.emit("pointerdown");
        this.btnup.emit("pointerout");

        // -- animações do player
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13],
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13],
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [2, 8, 2, 14],
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [0, 6, 0, 12],
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.cameras.main.setBounds(0, 0, 960, 640);

        //this.cameras.main.startFollow(this.player);

        this.cameras.main.roundPixels = true;

        this.socket.on("playerMoved", function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });
    },

    addPlayer: function (self, playerInfo) {
        self.player = self.physics.add.sprite(
            playerInfo.x,
            playerInfo.y,
            "player",
            6
        );
        self.player.setCollideWorldBounds(true);
        self.player.setScale(1.5);
        self.player.setVelocity(0);

        self.physics.add.collider(self.player, self.mapa);

        self.physics.add.collider(self.player, self.danoLava, () => {
            self.player.setPosition(30, 400);
        });

        self.physics.add.collider(self.player, self.danoEsp, () => {
            self.player.setPosition(30, 400);
        });

        self.physics.add.collider(self.player, self.obj, () => {
            self.player.disableBody(true, true);
            this.socket.emit("tempoFinal", self.timer);
        });
    },

    addOtherPlayers: function (self, playerInfo) {
        this.otherPlayers = this.physics.add.group();

        const otherPlayer = self.physics.add.sprite(
            playerInfo.x,
            playerInfo.y,
            "player",
            6
        );
        otherPlayer.setCollideWorldBounds(true);
        otherPlayer.setScale(1.5);
        otherPlayer.setVelocity(0);

        self.physics.add.collider(otherPlayer, self.mapa);

        self.physics.add.collider(otherPlayer, self.danoLava, () => {
            otherPlayer.setPosition(30, 400);
        });

        self.physics.add.collider(otherPlayer, self.danoEsp, () => {
            otherPlayer.setPosition(30, 400);
        });

        self.physics.add.collider(otherPlayer, self.obj, () => {
            otherPlayer.disableBody(true, true);
        });

        otherPlayer.playerId = playerInfo.playerId;
        self.otherPlayers.add(otherPlayer);
    },

    wait: function () {
        this.jogo = 0;
        this.espera.setText("À espera de jogadores");
    },

    start: function () {
        this.jogo = 1;
        console.log(this.jogo);

        if (this.jogo == 1) {
            this.espera.setText("");
            this.update();
        }
    },

    update: function () {
        if (this.jogo == 1) {
            this.timer++;
            this.tempoText.setText("Tempo: " + this.timer);
            if (this.player) {
                if (
                    this.direita == false &&
                    this.esquerda == false &&
                    this.cima == false
                ) {
                    this.player.body.setVelocityX(0);
                    this.player.anims.stop();
                } else if (
                    this.direita == true &&
                    this.esquerda == false &&
                    this.cima == false
                ) {
                    this.player.body.setVelocityX(180);
                    this.player.anims.play("right", true);
                    this.player.flipX = false;
                }
                if (
                    this.esquerda == true &&
                    this.direita == false &&
                    this.cima == false
                ) {
                    this.player.body.setVelocityX(-180);
                    this.player.anims.play("left", true);
                    this.player.flipX = true;
                }

                if (
                    this.cima == true &&
                    this.esquerda == false &&
                    this.direita == false &&
                    this.player.body.onFloor()
                ) {
                    this.player.setVelocityY(-250);
                }

                // Emitir o movimento do jogador
                var x = this.player.x;
                var y = this.player.y;

                if (
                    this.player.oldPosition &&
                    (x !== this.player.oldPosition.x ||
                        y !== this.player.oldPosition.y)
                ) {
                    this.socket.emit("playerMovement", {
                        x: this.player.x,
                        y: this.player.y,
                    });
                }

                // Guardar a posição antiga
                this.player.oldPosition = {
                    x: this.player.x,
                    y: this.player.y,
                };
            }
        }
    },
});
