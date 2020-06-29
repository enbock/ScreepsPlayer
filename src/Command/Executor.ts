import Queue, {Data, QueueEntry} from './Queue';

export interface Action {
  run(queueData: Data): ScreepsReturnCode;
}

export interface CommandToActionMap {
  [command: string]: Action
}

export default class Executor {
  private commandQueue: Queue;
  private commandToActionMap: CommandToActionMap;

  constructor(commandQueue: Queue, commandToActionMap: CommandToActionMap) {
    this.commandToActionMap = commandToActionMap;
    this.commandQueue = commandQueue;
  }

  run(): void {
    const queue: QueueEntry[] = this.commandQueue.pullQueue();

    queue.forEach((entry: QueueEntry): void => {
      const result: ScreepsReturnCode = this.commandToActionMap[entry.command].run(entry.data);
      if (result != OK) {
        this.commandQueue.add(entry);
      }
    });
  }
}
