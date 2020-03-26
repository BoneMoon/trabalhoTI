var WorldScene = Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function WorldScene() {
        Phaser.Scene.call(this, { key: "WorldScene" });
    },

    preload: function() {},

    create: function() {
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
        const mapa = map.createStaticLayer("chao", chao, 0, 0);
        const obj = map.createStaticLayer("porta", porta, 0, 0);
        const danoLava = map.createStaticLayer("lava", lava, 0, 0);
        const danoEsp = map.createStaticLayer("espinhos", espinhos, 0, 0);

        // colisões com as layers
        mapa.setCollisionByExclusion(-1, true);
        danoLava.setCollisionByExclusion(-1, true);
        danoEsp.setCollisionByExclusion(-1, true);

        // adicionar player
        this.player = this.physics.add.sprite(30, 400, "player", 6);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);
        this.player.setVelocity(0);

        // adicionar colisões
        this.physics.add.collider(this.player, mapa);

        this.physics.add.collider(this.player, danoLava, () => {
            this.player.disableBody(true, true);
        });

        this.physics.add.collider(this.player, danoEsp, () => {
            this.player.disableBody(true, true);
        });

        this.physics.add.collider(this.player, obj, () => {
            this.player.disableBody(true, true);
        });

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
    },

    update: function() {
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
    }
});
