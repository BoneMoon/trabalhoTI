var youLose = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function youLose() {
        Phaser.Scene.call(this, { key: "youLose" });
    },

    preload() {},

    create() {
        this.add.text(50, 50, "Perdeste!!!", {
            fontSize: "32px",
            fill: "#000000",
        });
    },
});
