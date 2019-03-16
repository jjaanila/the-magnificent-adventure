import NPC from "./NPC";

export default class MikeNPC extends NPC {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | integer) {
    super('Mike', scene, x, y, 'playerSpritesheet', frame);
  }
}