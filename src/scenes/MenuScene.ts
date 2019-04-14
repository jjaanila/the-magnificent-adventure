import DialogPlugin from "../DialogPlugin";
import Dialog, { DialogNode, DialogSpec } from "../Dialog";

export default class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private dialog: DialogPlugin;
  private isStarted: boolean = false;

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  private getDialog(): Dialog {
    const nodes = [
      new DialogNode({
        id: `menu-1`,
        playerAnswer: null,
        line: `Hello adventurer.`,
        speaker: 'narrator'
      }),
      new DialogNode({
        id: `menu-2`,
        playerAnswer: `...Hello?`,
        line: `How are you on this fine day?`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-2.1`,
        playerAnswer: `I'm feeling great, thanks for asking!`,
        line: `That is good to hear. \n\nIn that case, I can assume you might be up for a little adventure?`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-2.2`,
        playerAnswer: `It hasn't been that great day to be honest.`,
        line: `I'm sorry about that.\n\nI might have something to cheer you up. What about a nice little adventure? Would that make you feel better?`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-4`,
        playerAnswer: `Maybe I could try it.`,
        line: `Great. I'm sure you will love it.`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-3`,
        playerAnswer: `Absolutely!`,
        line: `That's the spirit.`,
        speaker: 'narrator',
      }),
      new DialogNode({
        id: `menu-5`,
        playerAnswer: `(Continue)`,
        line: `Welcome to Armasian, the empire of the emperor Armas VI. When one hears one of the words "empire" or "kingdom", the appearing thought is, more often than not, a postcard image of a great castle, magnificent garden, or some other overly pompous structure. The thought may also include throne or dining rooms sparkling with gold, or beautiful princesses and handsome knights.

This is not that kind of empire. In fact, most of the people wouldn't even consider this as an empire, or a country, or a nation. It resembles a loosely inhabited hostile tribe, hostility being mainly focused on the other members of the tribe. Strangers are highly honored and served, because they likely have means to leave the island of Armasian, as they have also been able to enter it. Not many souls enter this forsaken place, and those who do, will soon start to think about it. 

The famine has been collecting its toll for several years. The people have suffered and many have moved to greener pastures, or died trying to sail across the ocean with boat-like structures (Armasians are not particularly renowned seafarers. They don't even fish.). The rest were even crazier to stay, and the rough years have not exactly helped with their mental conditions.

The population is sparse, infrastructure close to nonexistent, and the court dirt poor. Crops can not even feed the farmers.
However, on modern standards Armasian is a decent community. Income differences are minuscule, everyone is equally hungry, and plagues can't thrive in this low populated, unvaccinated wasteland.

It's needless to say that life is hard. Luckily, so are you. You are a peasant who has suffered enough and is ready to leave the dying fields behind.`,
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
        from: `menu-2.1`,
        to: `menu-3`
      },
      {
        from: `menu-2.2`,
        to: `menu-4`
      },
      {
        from: `menu-3`,
        to: `menu-5`
      },
      {
        from: `menu-4`,
        to: `menu-5`
      }
    ];
    return new Dialog({nodes: nodes, links: links});
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
    this.dialog.on("end", () => {
      this.scene.start("OpeningScene")
    });
  }

  public create(): void {
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

  public update(): void {
    if (this.startKey.isDown) {
      if (this.isStarted) {
        return;
      }
      this.isStarted = true;
      this.bitmapTexts[0].setVisible(false);
      this.dialog.open(this.getDialog());
    }
  }
}