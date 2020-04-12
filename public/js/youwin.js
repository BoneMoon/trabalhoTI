var youWin = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function youWin() {
        Phaser.Scene.call(this, { key: "youWin" });
    },

    preload() {},

    create() {
        this.add.text(50, 50, "Ganhaste!!!", {
            fontSize: "32px",
            fill: "#000000",
        });
    },
});
