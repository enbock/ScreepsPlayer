import Memory from '../Screeps/Memory';
import Queue, {QueueEntry} from './Queue';

export interface Action {
  run(data: Memory): ScreepsReturnCode;
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
      const result:ScreepsReturnCode = this.commandToActionMap[entry.command].run(entry.memory);
      if (result != OK) {
        this.commandQueue.add(entry);
      }
    } catch (exception) {

    }
  }
}
