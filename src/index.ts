import 'phaser';
import MenuScene from './scenes/MenuScene';


class MagnificentGame {
    config: any;
    game: any;
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {}
            },
            scene: [MenuScene]
        };
    }

    run = () => {
        this.game = new Phaser.Game(this.config);
    }
}

const main = new MagnificentGame();
main.run();