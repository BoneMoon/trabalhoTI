const BootScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BootScene() {
        Phaser.Scene.call(this, { key: "BootScene" });
    },

    preload: function() {
       this.load.image("chao", "assets/mapa/chao.png");
       this.load.image("porta", "assets/mapa/lava_porta.png");
       this.load.image("lava", "assets/mapa/lava_porta.png");
       this.load.image("espinhos", "assets/mapa/espinhos.png");
       
       this.load.tilemapTiledJSON("mapas", "assets/mapa/mapas.json");

       //this.load.image("ceu", "assets/img/sky.png");
    },

    create: function() {
        this.scene.start("WorldScene");
    }
})