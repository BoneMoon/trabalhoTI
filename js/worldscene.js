var WorldScene = Phaser.Class ({
    Extends: Phaser.Scene,

    initialize: function WorldScene(){
        Phaser.Scene.call(this, {key: 'WorldScene'});
    },

    preload: function(){},

    create: function(){
        const map = this.make.tilemap({ key: "mapas" });

        const chao = map.addTilesetImage("chao", "chao");
        const porta = map.addTilesetImage("lava_porta", "porta");
        const lava = map.addTilesetImage("lava_porta", "lava");
        const espinhos = map.addTilesetImage("espinhos", "espinhos");

        const mapa = map.createStaticLayer("chao", chao, 0, 0);
        const obj = map.createStaticLayer("porta", porta, 0, 0);
        const danoLava = map.createStaticLayer("lava", lava, 0, 0);
        const danoEsp = map.createStaticLayer("espinhos", espinhos, 0, 0);

        //this.sky = this.add.image(0, 0, "ceu");
    }
})