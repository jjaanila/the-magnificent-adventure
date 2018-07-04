import 'phaser';

export default class Player {
    health: number;
    position: {
        x: number,
        y: number
    };
    sprite: any;
    spritesheetPath: string;
    constructor() {
        this.health = 100;
        this.position = {
            x: 100,
            y: 100
        };
        this.sprite = null;
        this.spritesheetPath = './assets/player.png'
    }
    load = (game: any) => {
        game.load.spritesheet('player', this.spritesheetPath, { frameWidth: 16, frameHeight: 16 });
    }
    update = (game: any) => {
        this.sprite = game.physics.add.sprite(this.position.x, this.position.y, 'player');
    }
}