export enum Command {
  CreateCreep = 'CreateCreep'
}

export interface Data {

}

export interface QueueEntry {
  command: Command
  data: Data
}

export class QueueEmptyException extends Error {}

export default class Queue {
  private queue: QueueEntry[];

  constructor() {
    this.queue = [];
  }

  add(data: QueueEntry): void {
    this.queue.push(data);
  }

  pull(): QueueEntry {
    if (this.queue.length == 0) {
      throw new QueueEmptyException();
    }

    return this.queue.shift();
  }
}
