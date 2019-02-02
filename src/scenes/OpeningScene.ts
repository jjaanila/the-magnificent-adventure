import Player from '../objects/player/Player';

export default class OpeningScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private terrainTileset: Phaser.Tilemaps.Tileset;
  private waterLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private terrain1Layer: Phaser.Tilemaps.StaticTilemapLayer;
  private terrain2Layer: Phaser.Tilemaps.StaticTilemapLayer;
  private structureTileset: Phaser.Tilemaps.Tileset;
  private structureLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private player: Player;

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
    this.waterLayer = this.map.createStaticLayer(
      "Water",
      this.terrainTileset,
      0,
      0
    );
    this.terrain1Layer = this.map.createStaticLayer(
      "Terrain 1",
      this.terrainTileset,
      0,
      0
    );
    this.terrain2Layer = this.map.createStaticLayer(
      "Terrain 2",
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
    this.physics.add.overlap(
      this.player,
      this.waterLayer,
      this.onCreatureEnteredWater,
      this.hasCreatureEnteredWater,
      this
    );
  }

  hasCreatureEnteredWater(creature: Player, waterLayer: any): boolean {
    if (waterLayer.index !== -1) {
      return true;
    }
    creature.setIsSwimming(false);
  }

  onCreatureEnteredWater(creature: Player, waterLayer: Phaser.Tilemaps.StaticTilemapLayer): void {
    creature.setIsSwimming(true);
  }

  update(): void {
    this.player.update();
  }

  private initGlobalData(): void {
    this.registry.set("spawn", { x: 16 * 12, y: 16 * 34, dir: "down" });
  }
}
