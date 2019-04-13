import NPC from "./NPC";
import Dialog, { DialogNode } from "../../Dialog";

export class MikeNPC extends NPC {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | integer) {
    super('Mike', scene, x, y, 'playerSpritesheet', frame);
  }

  public getDialog(): Dialog {
    const nodes = [
      new DialogNode({
        id: "mike-1",
        playerAnswer: null,
        line: "What.. He..Hello stranger! Who are you?",
        speaker: this
      }),
      new DialogNode({
        id: "mike-1.1",
        playerAnswer: `I'm {{player.name}}. Nice to see another living soul. It's been a while!`,
        speaker: this,
        line: `
          Do you call this living? A WHILE?! I have spent last 20 years in here waiting for a sign from the great Tzongos. Don't you come here bragging about hermiting!\
          It's my speciality!
        `
      }),
      new DialogNode({
        id: "mike-1.2",
        playerAnswer: `None of your business, peasant!`,
        line: "* The \"peasant\" reaches slowly into his pocket... He quickly pulls his hand out revealing the extended midmost finger of his right hand. *",
        speaker: "narrator"
      }),
      new DialogNode({
        id: "mike-2",
        playerAnswer: `O-kay then. Is this Tsongos some kind of god or?`,
        speaker: this,
        line: "\
          Well, basically yes... Or not quite, but very powerful in any case! Very strong magic! Says one word and, poof, you turn to a cuttlefish! \
        "
      }),
      new DialogNode({
        id: "mike-3.1",
        playerAnswer: `Sounds like a powerful wizard indeed.`,
        speaker: this,
        line: null
      }),
      new DialogNode({
        id: "mike-3.2",
        playerAnswer: `Ok, goodbye then.`,
        speaker: this,
        line: null,
      })
    ];
    const links = [
      {
        from: `mike-1`,
        to: `mike-1.1`
      },
      {
        from: `mike-1`,
        to: `mike-1.2`
      },
      {
        from: `mike-1.1`,
        to: `mike-2`
      },
      {
        from: `mike-2`,
        to: `mike-3.1`
      },
      {
        from: `mike-2`,
        to: `mike-3.2`
      },
    ];

    return new Dialog({nodes: nodes, links: links});
  }
}

export class JohnnyNPC extends NPC {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | integer) {
    super('Johnny', scene, x, y, 'playerSpritesheet', frame);
  }
}