import {ChangeActionData} from '../Command/Action/ChangeAction';
import {MoveData} from '../Command/Action/MoveCreep';
import Queue, {Command} from '../Command/Queue';
import CreepProvider from '../Screeps/CreepProvider';
import Memory from '../Screeps/Memory';

export default class MoveCreeps {
  private creepProvider: CreepProvider;
  private game: Game;
  private commandQueue: Queue;

  constructor(commandQueue: Queue, creepProvider: CreepProvider, game:Game) {
    this.game = game;
    this.commandQueue = commandQueue;
    this.creepProvider = creepProvider;
  }

  run(room: Room): void {
    const creeps: Creep[] = this.creepProvider.getMoving(room);
    creeps.forEach(
      (creep: Creep): void => {
        if(this.game.getObjectById((creep.memory as Memory).targetId) == null) {
          console.log("<<<<");
          this.commandQueue.add(
            {
              command: Command.ChangeAction,
              data: {
                creep: creep,
                action: IDLE,
                targetId: ''
              } as ChangeActionData
            }
          );
          return;
        }
        this.commandQueue.add(
          {
            command: Command.MoveCreep,
            data: {
              creep: creep
            } as MoveData
          }
        );
      }
    );
  }
}
