import Player from '../objects/player/Player';
import NPC from '../objects/npcs/NPC';

export default class OpeningScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private terrainTileset: Phaser.Tilemaps.Tileset;
  private eotlLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private groundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private overlappingLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private obstructionsLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private player: Player;
  private mikeNpc: NPC;

  constructor() {
    super({
      key: "OpeningScene",
    });
  }

  init(): void {
    this.initGlobalData();
  }

  create(): void {
    this.map = this.make.tilemap({ key: "openingLevel" });
    this.terrainTileset = this.map.addTilesetImage("outdoorsTerrainTiles");
    this.eotlLayer = this.map.createStaticLayer(
      "End of the world",
      this.terrainTileset,
      0,
      0
    );
    this.groundLayer = this.map.createStaticLayer(
      "Ground",
      this.terrainTileset,
      0,
      0
    );
    this.obstructionsLayer = this.map.createStaticLayer(
      "Obstructions",
      this.terrainTileset,
      0,
      0
    );
    this.obstructionsLayer.setName("obstructionsLayer");
    this.obstructionsLayer.setCollisionBetween(1, 10000, true);
    this.overlappingLayer = this.map.createStaticLayer(
      "Overlapping",
      this.terrainTileset,
      0,
      0
    );
    this.player = new Player(
      this,
      this.registry.get("spawn").x,
      this.registry.get("spawn").y,
      "playerSpritesheet"
    );
    this.player.body.collideWorldBounds = true;
    this.physics.add.overlap(
      this.player,
      this.eotlLayer,
      this.onCreatureEnteredWater,
      this.hasCreatureEnteredWater,
      this
    );

    this.mikeNpc = new NPC(
      'Mike',
      this,
      16 * 3,
      16 * 34,
      "playerSpritesheet"
    );
  }

  // FIXME: Checks collision for every tile, and returns varying indices in a burst. Should setIsSwimming only once per update
  hasCreatureEnteredWater(creature: Player, waterLayer: any): boolean {
    if (waterLayer.index !== -1) {
      return true;
    }
    creature.setIsSwimming(false);
    return false;
  }

  onCreatureEnteredWater(creature: Player, waterLayer: Phaser.Tilemaps.StaticTilemapLayer): void {
    creature.setIsSwimming(true);
  }

  update(): void {
    this.physics.collide(this.player, this.obstructionsLayer);
    this.player.update();
  }

  private initGlobalData(): void {
    this.registry.set("spawn", { x: 16 * 12, y: 16 * 34, dir: "down" });
  }
}
