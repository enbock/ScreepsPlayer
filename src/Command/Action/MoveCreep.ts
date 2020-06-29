import Memory from '../../Screeps/Memory';
import {Action} from '../Executor';
import {Data} from '../Queue';

export interface MoveData extends Data {
  creep: Creep
}

export default class MoveCreep implements Action {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public run(data: Data): ScreepsReturnCode {
    const creep: Creep = (data as MoveData).creep;
    const memory: Memory = creep.memory as Memory;
    const target: RoomObject | null = this.game.getObjectById(memory.targetId);
    if (target == null || !(target instanceof RoomObject)) {
      return;
    }
    memory.isWalking = (Math.abs(target.pos.x - creep.pos.x) + Math.abs(target.pos.y - creep.pos.y)) / 2 <= 1;

    creep.moveTo(
      target,
      {
        reusePath: 5,
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#555',
          lineStyle: 'dashed',
          strokeWidth: .15,
          opacity: .1
        }
      }
    );
  }

}
