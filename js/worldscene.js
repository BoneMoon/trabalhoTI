var WorldScene = Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function WorldScene() {
        Phaser.Scene.call(this, { key: "WorldScene" });
    },

    preload: function() {},

    create: function() {
        const map = this.make.tilemap({ key: "mapas" });

        const chao = map.addTilesetImage("chao", "chao");
        const porta = map.addTilesetImage("lava_porta", "porta");
        const lava = map.addTilesetImage("lava_porta", "lava");
        const espinhos = map.addTilesetImage("espinhos", "espinhos");

        const mapa = map.createStaticLayer("chao", chao, 0, 0);
        const obj = map.createStaticLayer("porta", porta, 0, 0);
        const danoLava = map.createStaticLayer("lava", lava, 0, 0);
        const danoEsp = map.createStaticLayer("espinhos", espinhos, 0, 0);

        mapa.setCollisionByExclusion(-1, true);
        danoLava.setCollisionByExclusion(-1, true);
        danoEsp.setCollisionByExclusion(-1, true);

        this.player = this.physics.add.sprite(30, 400, "player", 6);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2);
        this.player.setVelocity(0);
        this.physics.add.collider(this.player, mapa);
        this.physics.add.collider(this.player, danoLava);
        this.physics.add.collider(this.player, danoEsp);

        // -- adionar botões
        this.btndir = this.add.image(300, 500, "btndir").setInteractive();
        this.btndir.setScale(0.2);
        this.btndir.setScrollFactor(0);

        // this.btndir.on(
        //     "pointerout",
        //     function() {
        //         direita = false;
        //         this.player.body.setVelocityX(0);
        //         this.player.anims.stop();
        //     },

        //     this
        // );
        // this.btndir.on(
        //     "pointerdown",
        //     function() {
        //         direita = true;
        //         this.player.body.setVelocityX(180);
        //         this.player.anims.play("right", true);
        //         this.player.flipX = false;
        //     },
        //     this
        // );

        // this.btndir.emit("pointerout");
        // this.btndir.emit("pointerdown");

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

        //this.sky = this.add.image(0, 0, "ceu");
    },

    update: function() {}
});
