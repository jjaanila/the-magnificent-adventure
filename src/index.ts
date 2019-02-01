import 'phaser';
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import OpeningScene from "./scenes/OpeningScene";

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
      scene: [BootScene, MenuScene, OpeningScene]
    };
  }

  run = () => {
    this.game = new Phaser.Game(this.config);
  }
}

const main = new MagnificentGame();
main.run();