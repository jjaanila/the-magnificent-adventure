import Player from '../objects/player/Player';
import NPC from '../objects/npcs/NPC';
import { MikeNPC, JohnnyNPC} from '../objects/npcs/npcs';

export default class OpeningScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private terrainTileset: Phaser.Tilemaps.Tileset;
  private waterLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private groundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private overlappingLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private obstructionsLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private player: Player;
  private npcs: Phaser.GameObjects.Group;
  private mikeNpc: MikeNPC;
  private johnnyNpc: JohnnyNPC;

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
    this.waterLayer.setCollisionBetween(1, 10000, true);
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
      this.waterLayer,
      this.onCreatureEnteredWater,
      this.hasCreatureEnteredWater,
      this
    );
    
    this.npcs = this.add.group();
    this.mikeNpc = new MikeNPC(this, 16 * 3, 16 * 34);
    this.mikeNpc.body.collideWorldBounds = true;
    this.npcs.add(this.mikeNpc);
    this.johnnyNpc = new JohnnyNPC(this, 16 * 6, 16 * 22);
    this.johnnyNpc.body.collideWorldBounds = true;
    this.npcs.add(this.johnnyNpc);
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

  onNpcCollision(npc: NPC, someLayer: Phaser.Tilemaps.StaticTilemapLayer) {
    npc.onCollision();
  }

  update(): void {
    this.physics.collide(this.player, this.obstructionsLayer);
    this.physics.collide(this.npcs, this.obstructionsLayer, this.onNpcCollision);
    this.physics.collide(this.npcs, this.waterLayer, this.onNpcCollision);
    this.npcs.children.each(function(npc) {
      npc.update();
    }, this);
    this.player.update();
  }

  private initGlobalData(): void {
    this.registry.set("spawn", { x: 16 * 12, y: 16 * 34, dir: "down" });
  }
}
