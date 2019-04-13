import DialogPlugin from "../DialogPlugin";
import Dialog, { DialogNode, DialogSpec } from "../Dialog";

export default class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private dialog: DialogPlugin;

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
    this.load.scenePlugin({
        key: 'DialogPlugin',
        url: '../DialogPlugin.ts',
        sceneKey: 'dialog'
    });
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 200,
        this.sys.canvas.height / 2 + 40,
        "menuFont",
        "Press ENTER to play",
        45
      )
    );
    this.dialog.run(this.getDialog());
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("OpeningScene");
    }
  }

  getDialog(): Dialog {
    const nodes = [
      new DialogNode({
        id: `menu-1`,
        playerAnswer: null,
        line: `Hello adventurer.`,
        speaker: 'narrator'
      }),
      new DialogNode({
        id: `menu-2`,
        playerAnswer: `Uh... Hello?`,
        line: `How are you on this fine day?`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-2.1`,
        playerAnswer: `I'm feeling great, thanks for asking!`,
        line: `That is good to hear. \n\n `,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-2.2`,
        playerAnswer: `Umm, alright I guess.`,
        line: ``,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-2.3`,
        playerAnswer: `It hasn't been that great day to be honest`,
        line: ``,
        speaker: 'narrator',
      })
    ];
    const links = [
      {
        from: `menu-1`,
        to: `menu-2`
      },
      {
        from: `menu-2`,
        to: `menu-2.1`
      },
      {
        from: `menu-2`,
        to: `menu-2.2`
      },
      {
        from: `menu-2`,
        to: `menu-2.3`
      }
    ];
    return new Dialog({nodes: nodes, links: links});
  }
}