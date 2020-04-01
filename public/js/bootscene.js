const BootScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BootScene() {
        Phaser.Scene.call(this, { key: "BootScene" });
    },

    

    create: function() {
        this.scene.start("WorldScene");
    }
});
