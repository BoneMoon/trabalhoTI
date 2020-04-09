var Menu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Wait() {
        Phaser.Scene.call(this, { key: "Menu" });
    },

    preload() {},

    create() {
        var self = this;

        this.socket = io();

        this.add.text(60, 110, "Nome do Jogo", {
            fontSize: "40px",
            fill: "#000000",
        });

        this.tenta2 = this.add.image(300, 500, "btndir").setInteractive();
        this.tenta2.setScale(0.2);
        this.tenta2.setScrollFactor(0);

        this.socket.on("espera", function () {
            self.tenta2.on(
                "pointerup",
                function () {
                    console.log("espera");
                    alert("Espera por outros jogadores");
                },
                self
            );
        });

        this.socket.on("lotado", function () {
            self.tenta2.on(
                "pointerup",
                function () {
                    console.log("lotado");
                    alert("Jogo a Decorrer! Espere que o jogo acabe");
                },
                self
            );
        });

        this.socket.on("ready", function () {
            self.tenta2.on(
                "pointerup",
                function () {
                    console.log("JOGAR");
                    this.scene.start("WorldScene");
                },
                self
            );
        });
    },
});
