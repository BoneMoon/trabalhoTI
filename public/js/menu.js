var Menu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Wait() {
        Phaser.Scene.call(this, { key: "Menu" });
    },

    preload() {},

    create() {
        //var self = this;

        this.menu = this.add.text(240, 240, "Nome do Jogo", {
            fontSize: "40px",
            fill: "#000000",
        });

        //this.socket.on("menu", function () {});

        this.tenta2 = this.add.image(500, 500, "btndir").setInteractive();
        this.tenta2.setScale(0.2);
        this.tenta2.setScrollFactor(0);

        this.tenta2.on(
            "pointerup",
            function () {
                this.scene.start("WorldScene");
            },
            this
        );

        /* this.socket.on("lotado", function () {
            self.tenta2.on(
                "pointerup",
                function () {
                    console.log("lotado");
                    alert("Jogo a Decorrer! Espere que o jogo acabe");
                },
                self
            );
        });*/
    },
});
