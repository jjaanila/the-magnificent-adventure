
export default class Player extends Phaser.GameObjects.Sprite {
  private walkingVelocity: number = 100;
  private swimmingVelocity: number = 70;

  private currentScene: Phaser.Scene;
  private keys: Map<string, Phaser.Input.Keyboard.Key>;
  private velocity: number = this.walkingVelocity;
  public isSwimming = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
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
    this.body.setSize(10, 10);
    this.body.setCollideWorldBounds(true);
    this.setFrame(12);
  }

  update(): void {
    this.handleInput();
    this.handleAnimations();
  }

  handleInput(): void {
    const left = this.keys.get("LEFT");
    const right = this.keys.get("RIGHT");
    const up = this.keys.get("UP");
    const down = this.keys.get("DOWN");
    if (left && left.isDown) {
      this.body.velocity.x = -this.velocity;
    }
    else if (right && right.isDown) {
      this.body.velocity.x = this.velocity;
    }
    else {
      this.body.velocity.x = 0;
    }
    if (up && up.isDown) {
      this.body.velocity.y = -this.velocity;
    }
    else if (down && down.isDown) {
      this.body.velocity.y = this.velocity;
    }
    else {
      this.body.velocity.y = 0;
    }
    // Disable diagonal movement
    this.body.velocity.x = this.body.velocity.y === 0  ?  this.body.velocity.x : 0;
  }

  private shouldStartAnimation(newAnimKey: string): boolean {
    const nothingWasPlaying: boolean = Boolean(newAnimKey) && !this.anims.isPlaying || !this.anims.currentAnim;
    const isNewAnimation: boolean = Boolean(newAnimKey) && (this.anims.currentAnim && this.anims.currentAnim.key !== newAnimKey);
    return nothingWasPlaying || isNewAnimation;
  }

  private getWalkingAnimKey(): string | undefined {
    if (this.body.velocity.y < 0) {
      if (this.body.velocity.x === 0) {
        return "playerWalkUp";
      } else if (this.body.velocity.x > 0) {
        return "playerWalkUpRight";
      } else if (this.body.velocity.x < 0) {
        return "playerWalkUpLeft";
      }
    } else if (this.body.velocity.y > 0) {
      if (this.body.velocity.x === 0) {
        return "playerWalkDown";
      } else if (this.body.velocity.x > 0) {
        return "playerWalkDownRight";
      } else if (this.body.velocity.x < 0) {
        return "playerWalkDownLeft";
      }
    } else {
      if (this.body.velocity.x > 0) {
        this.setFlipX(false); // Walking right
        return "playerWalkHorizontally";
      } else if (this.body.velocity.x < 0) {
        this.setFlipX(true); // Walking left by reusing sprite playerWalkHorizontally
        return "playerWalkHorizontally";
      }
    }
  }

  private handleAnimations(): void {
    if (this.isSwimming) {
      this.shouldStartAnimation("swimming") && this.anims.play("swimming");
      return;
    }
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      // standing still
      this.setFrame(12);
      this.anims.stop();
      return;
    }
    let walkingAnimKey = this.getWalkingAnimKey();
    if (walkingAnimKey && this.shouldStartAnimation(walkingAnimKey)) {
      this.anims.play(walkingAnimKey);
    }    
  }

  public setIsSwimming(isSwimming: boolean): void {
    this.isSwimming = isSwimming;
    this.velocity = this.isSwimming ? this.swimmingVelocity : this.walkingVelocity;
  }
}