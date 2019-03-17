import NPC from "./NPC";

export class MikeNPC extends NPC {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | integer) {
    super('Mike', scene, x, y, 'playerSpritesheet', frame);
  }
}

export class JohnnyNPC extends NPC {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | integer) {
    super('Johnny', scene, x, y, 'playerSpritesheet', frame);
  }
}