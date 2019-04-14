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
  public currentStep: DialogStep;

  constructor(specs: DialogSpec, startNode?: DialogNode) {
    this.nodes = specs.nodes;
    this.links = specs.links;
    let currentNode: DialogNode;
    if (startNode) {
      currentNode = startNode;
    } else {
      currentNode = this.getStartNode();
    }
    this.currentStep = {
      currentNode: currentNode,
      nextNodes: []
    };
    this.currentStep.nextNodes = this.getNextNodes();
  }

  private getStartNode(): DialogNode {
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
      if ((this.currentStep.currentNode.id === link.from) && link.to) {
        nextNodes.push(this.getNode(link.to));
      }
    }
    return nextNodes;
  }

  public debug() {

  }

  public start(): DialogStep {
    return this.currentStep;
  }

  public answer(nextNodeId: DialogNodeId) {
    this.currentStep.currentNode = this.getNode(nextNodeId);
    this.currentStep.nextNodes = this.getNextNodes();
    return this.currentStep;
  }
}