import 'phaser';
import Player from './Player';

declare var Phaser: any;

const OpeningScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function OpeningScene() {
        Phaser.Scene.call(this, { key: 'opening' });
        this.player = new Player();
        this.cursors;
    },

    preload: function() {
        //this.load.tilemap('1_opening_tilemap', 'assets/1_opening_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        //this.load.image('terrain', 'assets/terrain_tiles.png');
        this.player.load(this);
    },

    create: function() {
        /*this.map = this.add.tilemap('1_opening_tilemap');
        this.map.addTilesetImage('1_opening_tilemap', 'terrain');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(20, true, this.layer);
*/
        this.player.update(this);
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (this.cursors.left.isDown) {
            this.player.sprite.body.velocity.x = -160;
        }
        else if (this.cursors.right.isDown) {
            this.player.sprite.body.velocity.x = 160;
        }
        else {
            this.player.sprite.body.velocity.x = 0;
        }
        if (this.cursors.up.isDown) {
            this.player.sprite.body.velocity.y = -160;
        }
        else if (this.cursors.down.isDown) {
            this.player.sprite.body.velocity.y = 160;
        }
        else {
            this.player.sprite.body.velocity.y = 0;
        }
    }
});

export default OpeningScene;
