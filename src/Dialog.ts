import Player from "./objects/player/Player";
import NPC from "./objects/npcs/NPC";

export type Participant = 'narrator' | NPC | Player;
export type PlayerAnswer = string | null;
export type Line = string | null;
export type DialogNodeId = string;

/**
 * The dialog format which is used to create the dialog tree.
 */
export interface DialogSpec {
  nodes: DialogNode[];
  links: DialogNodeLink[];
} 

export interface DialogNodeLink {
  from: DialogNodeId | null;
  to: DialogNodeId | null;
}

export interface DialogNodeParams {
  id: string;
  playerAnswer: PlayerAnswer;
  speaker: Participant;
  line: Line;
}

export type DialogStep = {
  currentNode: DialogNode,
  nextNodes: DialogNode[]
};

export class DialogNode {
  public id: string;
  public playerAnswer: PlayerAnswer;
  public speaker: Participant;
  public line: Line;

  constructor({id, line, speaker, playerAnswer}: DialogNodeParams) {
    this.id = id;
    this.line = line;
    this.speaker = speaker;
    this.playerAnswer = playerAnswer;
  }
}

export default class Dialog {
  private nodes: DialogNode[];
  private links: DialogNodeLink[];
  private currentNode: DialogNode;

  constructor(specs: DialogSpec, startNode?: DialogNode) {
    this.nodes = specs.nodes;
    this.links = specs.links;
    if (startNode) {
      this.currentNode = startNode;
    } else {
      this.currentNode = this.getStartNode();
    }
  }

  private getStartNode(): DialogNode {
    if (this.currentNode) {
      return this.currentNode;
    }
    for (const node of this.nodes) {
      let hasPreviousNode = false;
      for (const link of this.links) {
        if (link.to === node.id) {
          hasPreviousNode = true;
        }
      }
      if (!hasPreviousNode) {
        return node;
      }
    }
    throw new Error("Invalid Dialog. There was no nodes without previous node!");
  }

  private getNode(nodeId: DialogNodeId): DialogNode {
    for (const node of this.nodes) {
      if (node.id === nodeId) {
        return node;
      }
    }
    throw new Error(`Invalid nodeId ${nodeId}: not found`);
  }

  private getNextNodes(): DialogNode[] {
    const nextNodes: DialogNode[] = [];
    for (const link of this.links) {
      if (this.currentNode.id === link.from && link.to) {
        nextNodes.push(this.getNode(link.to));
      }
    }
    return nextNodes;
  }

  start(): DialogStep {
    return {
      currentNode: this.currentNode,
      nextNodes: this.getNextNodes()
    };
  }

  answer(nextNodeId: DialogNodeId) {
    this.currentNode = this.getNode(nextNodeId);
    return {
      currentNode: this.currentNode,
      nextNodes: this.getNextNodes()
    };
  }
}