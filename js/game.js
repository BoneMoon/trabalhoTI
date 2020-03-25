const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,

    scale: {
        node: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    zoom: 2,

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },

    scene: [
        // aqui entram as cenas
        BootScene,
        WorldScene,
    ]
};

const game = new Phaser.Game(config);