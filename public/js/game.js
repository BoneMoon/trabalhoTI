const config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 960,
    height: 640,
    // scale: {
    //     node: Phaser.Scale.RESIZE,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    //zoom: 2,
    backgroundColor: "#ffffff",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image("chao", "assets/mapa/chao.png");
    this.load.image("porta", "assets/mapa/lava_porta.png");
    this.load.image("lava", "assets/mapa/lava_porta.png");
    this.load.image("espinhos", "assets/mapa/espinhos.png");

    this.load.tilemapTiledJSON("mapas", "assets/mapa/mapas.json");

    this.load.spritesheet("player", "assets/img/RPG_assets.png", {
        frameWidth: 16,
        frameHeight: 16
    });

    this.load.image("btndir", "assets/img/rightButton.png");
    this.load.image("btnesq", "assets/img/leftButton.png");
    this.load.image("btnup", "assets/img/upButton.png");

    //this.load.image("ceu", "assets/img/sky.png");
}

function create() {
    var self = this;

    this.socket = io();

    this.otherPlayers = this.physics.add.group();

    this.socket.on("currentPlayers", function(players) {
        Object.keys(players).forEach(function(id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
    });

    this.socket.on("newPlayer", function(playerInfo) {
        addOtherPlayers(self, playerInfo);
    });

    this.socket.on("disconnect", function(playerId) {
        self.otherPlayers.getChildren().forEach(function(otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

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

    // -- adionar botão direito
    this.btndir = this.add.image(300, 500, "btndir").setInteractive();
    this.btndir.setScale(0.2);
    this.btndir.setScrollFactor(0);

    this.btndir.on(
        "pointerover",
        function() {
            this.direita = true;
        },

        this
    );
    this.btndir.on(
        "pointerdown",
        function() {
            this.direita = true;
            console.log("Olá :D");
            //this.player.setVelocityX(180);
        },
        this
    );

    this.btndir.on(
        "pointerout",
        function() {
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
        function() {
            this.esquerda = true;
        },

        this
    );
    this.btnesq.on(
        "pointerdown",
        function() {
            this.esquerda = true;
        },
        this
    );

    this.btnesq.on(
        "pointerout",
        function() {
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
        function() {
            this.cima = true;
        },

        this
    );
    this.btnup.on(
        "pointerdown",
        function() {
            this.cima = true;
        },
        this
    );

    this.btnup.on(
        "pointerout",
        function() {
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
            frames: [1, 7, 1, 13]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", {
            frames: [1, 7, 1, 13]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("player", {
            frames: [2, 8, 2, 14]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("player", {
            frames: [0, 6, 0, 12]
        }),
        frameRate: 10,
        repeat: -1
    });

    this.cameras.main.setBounds(0, 0, 960, 640);

    //this.cameras.main.startFollow(this.player);

    this.cameras.main.roundPixels = true;

    this.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
}

function addPlayer(self, playerInfo) {
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
        self.player.disableBody(true, true);
    });

    self.physics.add.collider(self.player, self.danoEsp, () => {
        self.player.disableBody(true, true);
    });

    self.physics.add.collider(self.player, self.obj, () => {
        self.player.disableBody(true, true);
    });

    //self.player.body.setAllowGravity(true);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.physics.add.sprite(
        playerInfo.x,
        playerInfo.y,
        "player",
        6
    );
    otherPlayer.setCollideWorldBounds(true);
    otherPlayer.setScale(1.5);
    otherPlayer.setVelocity(0);

    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

function update() {
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
        /*
            if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
                this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
            }
        */
        
        if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
            this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });
        }

        // Guardar a posição antiga
        this.player.oldPosition = {
            x: this.player.x,
            y: this.player.y
        };
    }
}
