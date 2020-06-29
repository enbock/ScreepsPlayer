import {ChangeActionData} from '../Command/Action/ChangeAction';
import Queue, {Command} from '../Command/Queue';
import CreepProvider from '../Screeps/CreepProvider';

export default class DefendHostiles {
  private commandQueue: Queue;
  private creepProvider: CreepProvider;

  constructor(commandQueue: Queue, creepProvider: CreepProvider) {
    this.creepProvider = creepProvider;
    this.commandQueue = commandQueue;
  }

  run(room: Room): void {
    const hostiles: Creep[] = this.creepProvider.getHostiles(room);
    if (hostiles.length == 0) return;
    const hostile: Creep = hostiles.shift();
    const defenders: Creep[] = this.creepProvider.getDefenders(room);

    defenders.forEach(
      (creep: Creep):void => {
        this.commandQueue.add(
          {
            command: Command.ChangeAction,
            data: {
              creep: creep,
              action: ATTACK,
              targetId: hostile.id
            } as ChangeActionData
          }
        );
      }
    );
  }
}
