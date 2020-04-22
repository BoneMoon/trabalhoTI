var youWin = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function youWin() {
        Phaser.Scene.call(this, { key: "youWin" });
    },

    preload() {},

    create() {
        this.ganha = this.sound.add('somGanha', {volume: 0.1, loop: true});

        this.ganha.play();
        
        this.add.text(240, 50, "PARABÉNS, GANHASTE!!!", {
            fontSize: "32px",
            fill: "#000000",
        });

        this.taca = this.add.image(450, 400, "taca");

        this.tenta2 = this.add.image(650, 590, "btndir").setInteractive();
        this.tenta2.setScale(0.2);
        this.tenta2.setScrollFactor(0);

        this.tenta2.on(
            "pointerup",
            function () {
                this.ganha.stop();
                this.scene.start("Menu");
            },
            this
        );
    },
});
