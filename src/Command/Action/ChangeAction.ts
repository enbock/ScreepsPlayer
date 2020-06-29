import Memory from '../../Screeps/Memory';
import {Action} from '../Executor';
import {Data} from '../Queue';

export interface ChangeActionData extends Data {
  creep: Creep,
  action: string,
  targetId: string,
}

export default class ChangeAction implements Action {

  run(queueData: Data): ScreepsReturnCode {
    const data: ChangeActionData = queueData as ChangeActionData;

    switch (data.action) {
      case ATTACK:
        data.creep.say('Attack!', true);
        break;
      case IDLE:
        data.creep.say('zzZ', true);
        break;
    }

    const memory: Memory = data.creep.memory as Memory;
    memory.targetId = data.targetId;
    memory.action = data.action;

    return OK;
  }
}
