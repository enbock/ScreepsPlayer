import randomizer from '../../randomizer';
import Memory from '../../Screeps/Memory';
import {Action} from '../Executor';

export interface CreepConfiguration {
  [role:string]: BodyPartConstant[]
}

export default class CreateCreep implements Action {
  private spawnPool: StructureSpawn;
  private creepConfigurations: CreepConfiguration;

  constructor(spawnPool: StructureSpawn, creepConfigurations:CreepConfiguration) {
    this.creepConfigurations = creepConfigurations;
    this.spawnPool = spawnPool;
  }

  run(data: Memory): ScreepsReturnCode {
    console.log('[CreateCreep] Spawn');
    return this.spawnPool.spawnCreep(
      this.creepConfigurations[data.role],
      'Miner:' + randomizer(),
      {
        memory: data
      }
    );
  }
}
