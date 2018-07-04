import 'phaser';
import OpeningScene from './levels';

declare var Phaser: any;

class MagnificantGame {
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
            scene: [OpeningScene]
        };
    }

    run = () => {
        this.game = new Phaser.Game(this.config);
    }
}
const main = new MagnificantGame();
main.run();