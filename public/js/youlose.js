var youLose = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function youLose() {
        Phaser.Scene.call(this, { key: "youLose" });
    },

    preload() {},

    create() {
        this.perde = this.sound.add('somPerde', {volume: 0.1, loop: true});

        this.perde.play();

        this.add.text(150, 150, "PERDESTE, MAIS SORTE PARA A PRÓXIMA", {
            fontSize: "32px",
            fill: "#000000",
        });

        this.lose = this.add.image(450, 400, "lose");

        this.tenta2 = this.add.image(650, 590, "btndir").setInteractive();
        this.tenta2.setScale(0.2);
        this.tenta2.setScrollFactor(0);

        this.tenta2.on(
            "pointerup",
            function () {
                this.perde.stop();
                this.scene.start("Menu");
            },
            this
        );
    },
});
