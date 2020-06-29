import {ExecuteActionData} from '../Command/Action/ExecuteAction';
import Queue, {Command} from '../Command/Queue';
import CreepProvider from '../Screeps/CreepProvider';

export default class ExecuteCreeps {
  private creepProvider: CreepProvider;
  private commandQueue: Queue;

  constructor(commandQueue: Queue, creepProvider: CreepProvider) {
    this.commandQueue = commandQueue;
    this.creepProvider = creepProvider;
  }

  run(room: Room): void {
    this.creepProvider.getAllOwned(room).forEach((creep: Creep): void => {
      this.commandQueue.add(
        {
          command: Command.ExecuteAction,
          data: {
            creep: creep
          } as ExecuteActionData
        }
      );
    });
  }
}
