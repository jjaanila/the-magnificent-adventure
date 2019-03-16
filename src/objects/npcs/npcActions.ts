import NPC from "./NPC";

export type NPCActionType = 'wait' | 'travel' | 'speakToX' | 'die';

export class NPCAction {
  public type: NPCActionType;
  constructor(type: NPCActionType) {
    this.type = type;
  }

  /**
   * This method should be called repeatedly to continue with action execution.
   * Should return true after the action has ended, otherwise false. 
   */
  public act(): boolean {
    throw new Error('Not implemented');
  }
};

export type NPCActionTravelDestination = {
  x: number,
  y: number
};

export class NPCActionTravel extends NPCAction {
  private destination: NPCActionTravelDestination;
  private npc: NPC;

  constructor(type: NPCActionType, npc: NPC, destination: NPCActionTravelDestination) {
    super(type);
    this.destination = destination;
    this.npc = npc;
  }

  public act(): boolean {
    if (this.hasEnded()) {
      return true;
    }
    return false;
  }

  private hasEnded(): boolean {
    return Math.abs(this.destination.x - this.npc.x) < 5 && Math.abs(this.destination.y - this.npc.y) < 5; // I shall name this CloseEnough™
  }
}

export class NPCActionWait extends NPCAction {
  private seconds: number;
  private startTime: Date;

  constructor(type: NPCActionType, seconds: number) {
    super(type);
    this.seconds = seconds;
    this.startTime = new Date();
  }

  public act(): boolean {
    if (this.hasEnded()) {
      return true;
    }
    return false;
  }

  private hasEnded(): boolean {
    return ((new Date().getTime() - this.startTime.getTime()) / 1000) > this.seconds;
  }
}

export class NPCActionSpeakToX extends NPCAction {
  constructor() {
    super('speakToX');
    throw new Error('Not implemented');
  }
}

export class NPCActionDie extends NPCAction {
  constructor() {
    super('die');
    throw new Error('Not implemented');
  }
}