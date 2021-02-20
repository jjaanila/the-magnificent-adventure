import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import OpeningScene from "./scenes/OpeningScene";
import DialogPlugin from "./DialogPlugin";

class MagnificentGame {
    config: Phaser.Types.Core.GameConfig;
    game: Phaser.Game | undefined;
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: 1100,
            height: 672,
            physics: {
                default: "arcade",
                arcade: {
                    debug: true,
                },
            },
            scene: [BootScene, MenuScene, OpeningScene],
            render: {
                pixelArt: true,
            },
            plugins: {
                scene: [
                    {
                        key: "DialogPlugin",
                        plugin: DialogPlugin,
                        start: false,
                        mapping: "dialog",
                    },
                ],
            },
        };
    }

    run = () => {
        this.game = new Phaser.Game(this.config);
    };
}

const main = new MagnificentGame();
main.run();
