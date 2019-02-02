
export default class Player extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private health: number;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
    this.health = 100;
    this.currentScene = scene;
    this.init();
    this.currentScene.add.existing(this);
  }

  init(): void {
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);
    this.keys = new Map([
      ["LEFT", this.currentScene.input.keyboard.addKey("LEFT")],
      ["RIGHT", this.currentScene.input.keyboard.addKey("RIGHT")],
      ["DOWN", this.currentScene.input.keyboard.addKey("DOWN")],
      ["UP", this.currentScene.input.keyboard.addKey("UP")]
    ]);

    this.currentScene.physics.world.enable(this);
    this.body.setSize(16, 16);
  }

  update(): void {
    this.handleInput();
    this.handleAnimations();
  }

  handleInput(): void {
    if (this.keys.get("LEFT").isDown) {
      this.body.velocity.x = -160;
    }
    else if (this.keys.get("RIGHT").isDown) {
      this.body.velocity.x = 160;
    }
    else {
      this.body.velocity.x = 0;
    }
    if (this.keys.get("UP").isDown) {
      this.body.velocity.y = -160;
    }
    else if (this.keys.get("DOWN").isDown) {
      this.body.velocity.y = 160;
    }
    else {
      this.body.velocity.y = 0;
    }
    // Disable diagonal movement
    this.body.velocity.x = this.body.velocity.y === 0  ?  this.body.velocity.x : 0;
  }

  private shouldStartAnimation(newAnimKey: string): boolean {
    return (newAnimKey && !this.anims.isPlaying) || (newAnimKey && (!this.anims.currentAnim || this.anims.currentAnim.key !== newAnimKey));
  }

  private handleAnimations(): void {
    let newAnimKey = this.anims.currentAnim && this.anims.currentAnim.key;
    if (this.body.velocity.y < 0) {
      if (this.body.velocity.x === 0) {
        newAnimKey = "playerWalkUp";
      } else if (this.body.velocity.x > 0) {
        newAnimKey = "playerWalkUpRight";
      } else if (this.body.velocity.x < 0) {
        newAnimKey = "playerWalkUpLeft";
      }
    } else if (this.body.velocity.y > 0) {
      if (this.body.velocity.x === 0) {
        newAnimKey = "playerWalkDown";
      } else if (this.body.velocity.x > 0) {
        newAnimKey = "playerWalkDownRight";
      } else if (this.body.velocity.x < 0) {
        newAnimKey = "playerWalkDownLeft";
      }
    } else {
      if (this.body.velocity.x > 0) {
        this.setFlipX(false); // Walking right
        newAnimKey = "playerWalkHorizontally";
      } else if (this.body.velocity.x < 0) {
        this.setFlipX(true); // Walking left by reusing sprite playerWalkHorizontally
        newAnimKey = "playerWalkHorizontally";
      }
    }
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      // standing still
      this.setFrame(12);
      this.anims.stop();
    } else if (this.shouldStartAnimation(newAnimKey)) {
      this.anims.play(newAnimKey);
    }
  }
}