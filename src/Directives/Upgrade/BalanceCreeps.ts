import CreepProvider from '../../Screeps/CreepProvider';
import Role from '../../Screeps/Role';
import {CreepAmountTarget, UpgradeDirective} from '../Handler';

export default class BalanceCreeps implements UpgradeDirective {
  targetByRoomLevel: number[];
  private readonly creepAmountTarget: CreepAmountTarget;
  private creepProvider: CreepProvider;

  constructor(creepAmountTarget: CreepAmountTarget, creepProvider: CreepProvider) {
    this.creepProvider = creepProvider;
    this.creepAmountTarget = creepAmountTarget;
    this.targetByRoomLevel = [1, 5, 15, 30, 30, 30, 30, 30, 30];
  }

  run(room: Room): void {
    const miner: Creep[] = this.creepProvider.getByRole(room, Role.Miner);
    const defender: Creep[] = this.creepProvider.getByRole(room, Role.Defender);

    const target: number = Math.min(miner.length, defender.length);

    const controllers: StructureController[] = room.find(
      FIND_MY_STRUCTURES,
      {
        filter: function (object: AnyOwnedStructure): boolean {
          return object instanceof StructureController;
        }
      }
    ) as StructureController[];

    if (target < this.targetByRoomLevel[controllers[0] ? controllers[0].level : 0]) {
      this.creepAmountTarget[Role.Defender] = (target + 1) * 2;
      this.creepAmountTarget[Role.Miner] = target + 1;
    }
  }

}
