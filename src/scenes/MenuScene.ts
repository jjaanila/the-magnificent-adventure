export default class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.startKey.isDown = false;
    this.initGlobalData();
  }

  preload(): void {
    this.load.pack(
        "preload",
        "./assets/pack.json",
        "preload"
    );
  }

  create(): void {
    this.add.image(0, 0, "title").setOrigin(0, 0);

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 200,
        this.sys.canvas.height / 2 + 40,
        "menuFont",
        "Press ENTER to play",
        45
      )
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("OpeningScene");
    }
  }

  private initGlobalData(): void {
    this.registry.set("spawn", { x: 40, y: 40, dir: "down" });
  }
}