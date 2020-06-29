import randomizer from '../../randomizer';
import Memory from '../../Screeps/Memory';
import Role from '../../Screeps/Role';
import SpawnProvider from '../../Screeps/SpawnProvider';
import {Action} from '../Executor';
import {Data} from '../Queue';

export interface CreepConfiguration {
  [role: string]: BodyPartConstant[]
}

export interface CreateCreepData extends Data {
  room: Room,
  role: Role
}

export default class CreateCreep implements Action {
  private spawnProvider: SpawnProvider;
  private readonly creepConfigurations: CreepConfiguration;

  constructor(spawnProvider: SpawnProvider, creepConfigurations: CreepConfiguration) {
    this.spawnProvider = spawnProvider;
    this.creepConfigurations = creepConfigurations;
  }

  run(queueData: Data): ScreepsReturnCode {
    const data: CreateCreepData = queueData as CreateCreepData;
    let result: ScreepsReturnCode = ERR_BUSY;
    const spawnPool: StructureSpawn[] = this.spawnProvider.getByRoom(data.room);

    for (let index = 0; index < spawnPool.length && result != OK; index++) {
      result = spawnPool[index].spawnCreep(
        this.creepConfigurations[data.role],
        'Miner:' + randomizer(),
        {
          memory: {
            role: data.role
          } as Memory
        }
      );
    }

    return result;
  }
}
