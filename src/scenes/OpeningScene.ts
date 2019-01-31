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
            key: "opening"
        });
    }

    init(): void {}

    create(): void {
        this.map = this.make.tilemap({ key: this.registry.get("level") });
        this.terrainTileset = this.map.addTilesetImage("outdoors_terrain");
        this.terrainLayer = this.map.createStaticLayer(
            "terrainLayer",
            this.terrainTileset,
            0,
            0
        );
        this.structureLayer = this.map.createStaticLayer(
            "structureLayer",
            this.terrainTileset,
            0,
            0
        );
        //this.structureLayer.setName("structureLayer");
        this.player = new Player(
            this,
            this.registry.get("spawn").x,
            this.registry.get("spawn").y,
            "player"
        );
        // set collision for tiles with the property collide set to true
        this.structureLayer.setCollisionByProperty({ collide: true });
        this.player.update();
    }

    update(): void {
        this.player.update();
    }
}
