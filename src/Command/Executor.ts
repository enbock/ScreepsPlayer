import Queue, {Data, QueueEntry} from './Queue';

export interface Action {
  run(data: Data): ScreepsReturnCode;
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
    try {
      const entry: QueueEntry = this.commandQueue.pull();
      const result: ScreepsReturnCode = this.commandToActionMap[entry.command].run(entry.data);
      if (result != OK) {
        this.commandQueue.add(entry);
      }
    } catch (exception) {

    }
  }
}
