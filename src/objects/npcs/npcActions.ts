import NPC from "./NPC";

export type NPCActionType = "wait" | "travel" | "speakToX" | "die";

export class NPCAction {
    public type: NPCActionType;
    public npc: NPC;

    constructor(type: NPCActionType, npc: NPC) {
        this.type = type;
        this.npc = npc;
    }

    /**
     * This method should be called repeatedly to continue with action execution.
     * Should return true after the action has ended, otherwise false.
     */
    public act(): boolean {
        throw new Error("Not implemented");
    }
}

export type NPCActionTravelDestination = {
    x: number;
    y: number;
};

export class NPCActionTravel extends NPCAction {
    private destination: NPCActionTravelDestination;
    private stopAt: Date | undefined;

    constructor(npc: NPC, destination: NPCActionTravelDestination, stopTimeoutSeconds?: number) {
        super("travel", npc);
        this.destination = destination;
        if (stopTimeoutSeconds !== undefined && stopTimeoutSeconds > 0) {
            const stopAt = new Date();
            stopAt.setSeconds(stopAt.getSeconds() + stopTimeoutSeconds);
            this.stopAt = stopAt;
        }
    }

    public act(): boolean {
        if (this.hasEnded()) {
            this.npc.stopMoving();
            return true;
        }
        this.npc.moveTo(this.destination);
        return false;
    }

    private hasEnded(): boolean {
        if (this.stopAt && new Date() > this.stopAt) {
            return true;
        }
        return Math.abs(this.destination.x - this.npc.x) < 2 && Math.abs(this.destination.y - this.npc.y) < 2; // I shall name this CloseEnough™
    }
}

export class NPCActionWait extends NPCAction {
    private seconds: number;
    private startTime: Date;

    constructor(npc: NPC, seconds: number) {
        super("wait", npc);
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
        return (new Date().getTime() - this.startTime.getTime()) / 1000 > this.seconds;
    }
}

export class NPCActionSpeakToX extends NPCAction {
    constructor(npc: NPC) {
        super("speakToX", npc);
        throw new Error("Not implemented");
    }
}

export class NPCActionDie extends NPCAction {
    constructor(npc: NPC) {
        super("die", npc);
        throw new Error("Not implemented");
    }
}
