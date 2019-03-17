import { NPCAction, NPCActionWait, NPCActionTravel } from './npcActions';

export default class NPC extends Phaser.GameObjects.Sprite {
  private MAX_WANDER_WAIT_SECONDS = 3;
  private MIN_WANDER_WAIT_SECONDS = 2;
  private MAX_WANDER_DISTANCE = 40;
  private MIN_WANDER_DISTANCE = 10;
  
  private walkingVelocity: number = 5;
  private swimmingVelocity: number = 70;
  private currentScene: Phaser.Scene;
  private currentAction: NPCAction | undefined;
  private lastWanderAction: NPCAction;

  public velocity: number = this.walkingVelocity;
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
    const nothingWasPlaying: boolean = Boolean(newAnimKey) && !this.anims.isPlaying || !this.anims.currentAnim;
    const isNewAnimation: boolean = Boolean(newAnimKey) && (this.anims.currentAnim && this.anims.currentAnim.key !== newAnimKey);
    return nothingWasPlaying || isNewAnimation;
  }

  private handleActions(): void {
    if (this.currentAction) {
      const hasActionEnded = this.currentAction.act();
      if (hasActionEnded)  {
        this.currentAction = undefined;
      }
    } else {
      this.wander();
    }
  }

  private wander(): void {
    if (this.lastWanderAction instanceof NPCActionWait) {
      const distance = (Math.round(Math.random()) ? -1 : 1) * Math.round(Math.random() * (this.MAX_WANDER_DISTANCE - this.MIN_WANDER_DISTANCE) + this.MIN_WANDER_DISTANCE);
      const xOrY = Boolean(Math.round(Math.random()));
      this.currentAction = new NPCActionTravel(this, {
        x: this.body.center.x + (xOrY ? distance : 0),
        y: this.body.center.y + (!xOrY ? distance : 0)
      },
      5.0);
    }
    else {
      this.currentAction = new NPCActionWait(this, Math.round(
        Math.random() * (this.MAX_WANDER_WAIT_SECONDS - this.MIN_WANDER_WAIT_SECONDS) + this.MIN_WANDER_WAIT_SECONDS
      ));
    }
    this.lastWanderAction = this.currentAction;
  }

  private getWalkingAnimKey(): string | undefined {
    const velocityX = Math.round(this.body.velocity.x);
    const velocityY = Math.round(this.body.velocity.y);
    if (velocityY < 0) {
      if (velocityX === 0) {
        return "playerWalkUp";
      }
    } else if (velocityY > 0) {
      if (velocityX === 0) {
        return "playerWalkDown";
      }
    } else {
      if (velocityX > 0) {
        this.setFlipX(false); // Walking right
        return "playerWalkHorizontally";
      } else if (velocityX < 0) {
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

  public moveTo(destination: {x: number, y: number}) {
    this.currentScene.physics.moveTo(this, destination.x, destination.y, this.velocity);
  }

  public stop() {
    this.body.reset(this.body.center.x, this.body.center.y);
  }

  public onCollision() {
    if (this.currentAction && this.currentAction instanceof NPCActionTravel) {
      this.currentAction = undefined;
      this.stop();
    }
  }

  public setIsSwimming(isSwimming: boolean): void {
    this.isSwimming = isSwimming;
    this.velocity = this.isSwimming ? this.swimmingVelocity : this.walkingVelocity;
  }
}