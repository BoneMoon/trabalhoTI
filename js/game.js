const config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 960,
    height: 640,
    // scale: {
    //     node: Phaser.Scale.RESIZE,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    //zoom: 2,
    backgroundColor: "#ffffff",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: [
        // aqui entram as cenas
        BootScene,
        WorldScene
    ]
};

const game = new Phaser.Game(config);
