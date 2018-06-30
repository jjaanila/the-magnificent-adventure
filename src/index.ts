import 'phaser';

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
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: {
                preload: this.preload,
                create: this.create
            }
        };
    }

    run = () => {
        this.game = new Phaser.Game(this.config);
    }

    preload = function(this: any) {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
        this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png');
        this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png');
    }

    create = function(this: any) {
        this.add.sprite(100, 100, 'logo');
    }
}
const main = new MagnificantGame();
main.run();