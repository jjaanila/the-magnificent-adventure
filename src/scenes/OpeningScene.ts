import Player from '../Player';

export default class OpeningScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private terrainTileset: Phaser.Tilemaps.Tileset;
  private terrainLayer: Phaser.Tilemaps.StaticTilemapLayer;
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
    this.terrainLayer = this.map.createStaticLayer(
      "Terrain 1",
      this.terrainTileset,
      0,
      0
    );
    this.player = new Player(
      this,
      this.registry.get("spawn").x,
      this.registry.get("spawn").y,
      "player"
    );
    // set collision for tiles with the property collide set to true
    //this.structureLayer.setCollisionByProperty({ collide: true });
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  update(): void {
    this.player.update();
  }

  private initGlobalData(): void {
    this.registry.set("spawn", { x: 40, y: 40, dir: "down" });
  }
}
