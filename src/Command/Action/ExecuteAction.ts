import Memory from '../../Screeps/Memory';
import {Action} from '../Executor';
import {Data} from '../Queue';

export interface ExecuteActionData extends Data {
  creep: Creep
}

export default class ExecuteAction implements Action {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public run(queueData: Data): ScreepsReturnCode {

    const creep: Creep = (queueData as ExecuteActionData).creep;
    const memory: Memory = creep.memory as Memory;
    const target: Creep | null = this.game.getObjectById(memory.targetId);
    switch (memory.action) {
      case ATTACK:
        if (target == null) {
          break;
        }
        if (this.bodyHas(creep, ATTACK)) creep.attack(target);
        if (this.bodyHas(creep, RANGED_ATTACK)) creep.rangedAttack(target);
        break;
    }

    return OK;
  }

  private bodyHas(creep: Creep, type: string): boolean {
    return creep.body.filter((definition: BodyPartDefinition): boolean => definition.type == type).length > 0;
  }

}
