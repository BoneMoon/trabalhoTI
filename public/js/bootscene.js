var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BootScene() {
        Phaser.Scene.call(this, { key: "BootScene" });
    },

    preload: function () {
        this.load.image("chao", "assets/mapa/chao.png");
        this.load.image("porta", "assets/mapa/lava_porta.png");
        this.load.image("lava", "assets/mapa/lava_porta.png");
        this.load.image("espinhos", "assets/mapa/espinhos.png");

        this.load.tilemapTiledJSON("mapas", "assets/mapa/mapas.json");

        this.load.spritesheet("player", "assets/img/RPG_assets.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.image("btndir", "assets/img/rightButton.png");
        this.load.image("btnesq", "assets/img/leftButton.png");
        this.load.image("btnup", "assets/img/upButton.png");

        this.load.image("taca", "assets/img/taca.jpg");
    },

    create: function () {
        this.scene.start("Menu");
    },
});
