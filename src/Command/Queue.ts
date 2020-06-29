export enum Command {
  CreateCreep = 'CreateCreep',
  MoveCreep = 'MoveCreep',
  ChangeAction = 'ChangeAction',
  ExecuteAction = 'ExecuteAction',
}

export interface Data {

}

export interface QueueEntry {
  command: Command
  data: Data
}

export default class Queue {
  private queue: QueueEntry[];

  constructor() {
    this.queue = [];
  }

  add(data: QueueEntry): void {
    this.queue.push(data);
  }

  pullQueue(): QueueEntry[] {
    const result:QueueEntry[] = this.queue;
    this.queue = [];

    return result;
  }
}
