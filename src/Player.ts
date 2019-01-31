
export default class Player extends Phaser.GameObjects.Sprite {
    private currentScene: Phaser.Scene;
    private health: number;
    private spritesheetPath: string;
    private keys: Map<string, Phaser.Input.Keyboard.Key>;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.health = 100;
        this.spritesheetPath = './assets/player.png'
        this.currentScene = scene;
        this.init();
        this.currentScene.add.existing(this);
    }

    init(): void {
        this.setOrigin(0.5, 0.5);
        this.setFlipX(false);
        this.keys = new Map([
            ["LEFT", this.currentScene.input.keyboard.addKey("LEFT")],
            ["RIGHT", this.currentScene.input.keyboard.addKey("RIGHT")],
            ["DOWN", this.currentScene.input.keyboard.addKey("DOWN")],
            ["UP", this.currentScene.input.keyboard.addKey("UP")]
        ]);
        this.currentScene.physics.world.enable(this);
        this.body.maxVelocity.x = 50;
        this.body.maxVelocity.y = 300;
    }

    update(): void {
        this.handleInput();
    }

    handleInput(): void {
        if (this.keys.get("LEFT").isDown) {
            this.body.velocity.x = -160;
        }
        else if (this.keys.get("RIGHT").isDown) {
            this.body.velocity.x = 160;
        }
        else {
            this.body.velocity.x = 0;
        }
        if (this.keys.get("UP").isDown) {
            this.body.velocity.y = -160;
        }
        else if (this.keys.get("DOWN").isDown) {
            this.body.velocity.y = 160;
        }
        else {
            this.body.velocity.y = 0;
        }
    } 
}