import 'phaser';
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import OpeningScene from "./scenes/OpeningScene";

class MagnificentGame {
  config: GameConfig;
  game: Phaser.Game;
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 1120,
      height: 672,
      physics: {
        default: 'arcade',
        arcade: {}
      },
      scene: [BootScene, MenuScene, OpeningScene],
      render: {
        pixelArt: true
      }
    };
  }

  run = () => {
    this.game = new Phaser.Game(this.config);
  }
}

const main = new MagnificentGame();
main.run();