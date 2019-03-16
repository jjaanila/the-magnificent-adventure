import { NPCAction, NPCActionWait, NPCActionTravel } from './npcActions';

export default class NPC extends Phaser.GameObjects.Sprite {
  private walkingVelocity: number = 140;
  private swimmingVelocity: number = 70;
  private currentScene: Phaser.Scene;

  private velocity: number = this.walkingVelocity;
  private currentAction: NPCAction | undefined;
  public name: string;
  public isSwimming = false;

  constructor(
    name: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | integer
    ) {
    super(scene, x, y, texture, frame);
    this.name = name;
    this.currentScene = scene;
    this.init();
    this.currentScene.add.existing(this);
  }

  public init(): void {
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.currentScene.physics.world.enable(this);
    this.body.setSize(10, 10);
    this.body.setCollideWorldBounds(true);
    this.setFrame(12);
  }

  public update(): void {
    this.handleActions();
    this.handleAnimations();
  }

  private shouldStartAnimation(newAnimKey: string): boolean {
    return (newAnimKey && !this.anims.isPlaying) || (newAnimKey && (!this.anims.currentAnim || this.anims.currentAnim.key !== newAnimKey));
  }

  private handleActions(): void {
    if (this.currentAction) {
      this.currentAction.act();
    } else {
      this.wander();
    }
  }

  private wander(): void {
    switch (Math.round(Math.random())) {
      case 0:

    }
    const actionClass = [NPCActionWait, NPCActionTravel]
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
      if (this.shouldStartAnimation("swimming")) {
        this.anims.play("swimming");
      }
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