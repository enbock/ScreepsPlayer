import Memory from '../Screeps/Memory';

export enum Command {
  CreateCreep = 'CreateCreep'
}

export interface QueueEntry {
  command: Command
  memory: Memory
}

export class QueueEmptyException extends Error {}

export default class Queue {
  private queue: QueueEntry[];

  constructor() {
    this.queue = [];
  }

  add(entry: QueueEntry): void {
    this.queue.push(entry);
  }

  pull(): QueueEntry {
    if (this.queue.length == 0) {
      throw new QueueEmptyException();
    }

    return this.queue.shift();
  }
}
