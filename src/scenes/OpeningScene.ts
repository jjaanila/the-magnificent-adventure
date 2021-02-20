import Player from "../objects/player/Player";
import NPC from "../objects/npcs/NPC";
import { MikeNPC, JohnnyNPC } from "../objects/npcs/npcs";

export default class OpeningScene extends Phaser.Scene {
    private map?: Phaser.Tilemaps.Tilemap;
    private terrainTileset?: Phaser.Tilemaps.Tileset;
    private waterLayer: Phaser.Tilemaps.TilemapLayer;
    private obstructionsLayer: Phaser.Tilemaps.TilemapLayer;
    private player?: Player;
    private npcs?: Phaser.GameObjects.Group;
    private mikeNpc?: MikeNPC;
    private johnnyNpc?: JohnnyNPC;

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
        this.waterLayer = this.map.createLayer("Water", this.terrainTileset, 0, 0);

        this.waterLayer.setCollisionBetween(1, 10000, true);
        this.map.createLayer("Ground", this.terrainTileset, 0, 0);
        this.obstructionsLayer = this.map.createLayer("Obstructions", this.terrainTileset, 0, 0);
        this.obstructionsLayer.setName("obstructionsLayer");
        this.obstructionsLayer.setCollisionBetween(1, 10000, true);
        this.map.createLayer("Overlapping", this.terrainTileset, 0, 0);
        this.player = new Player(this, this.registry.get("spawn").x, this.registry.get("spawn").y, "playerSpritesheet");
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
    hasCreatureEnteredWater(
        creature: Phaser.GameObjects.GameObject,
        waterLayer: Phaser.GameObjects.GameObject
    ): boolean {
        if (waterLayer === this.waterLayer && waterLayer instanceof Phaser.Tilemaps.TilemapLayer) {
            return true;
        }
        if (creature instanceof Player) {
            creature.setIsSwimming(false);
        }
        return false;
    }

    onCreatureEnteredWater(creature: Phaser.GameObjects.GameObject): void {
        if (creature instanceof Player) {
            creature.setIsSwimming(true);
        }
    }

    onNpcCollision(npc: Phaser.GameObjects.GameObject) {
        if (npc instanceof NPC) {
            npc.onCollision();
        }
    }

    update(): void {
        if (this.player) {
            this.physics.collide(this.player, this.obstructionsLayer);
        }
        if (this.npcs) {
            this.physics.collide(this.npcs, this.obstructionsLayer, this.onNpcCollision);
            this.physics.collide(this.npcs, this.waterLayer, this.onNpcCollision);
            this.npcs.children.each(function (npc) {
                npc.update();
            }, this);
        }
        if (this.player) {
            this.player.update();
        }
    }

    private initGlobalData(): void {
        this.registry.set("spawn", { x: 16 * 12, y: 16 * 34, dir: "down" });
    }
}
