import Memory from './Memory';
import Role from './Role';

export default class CreepProvider {
  public getAllOwned(room: Room): Creep[] {
    return room.find(FIND_MY_CREEPS);
  }

  public getHostiles(room: Room): Creep[] {
    return room.find(FIND_HOSTILE_CREEPS);
  }

  public getDefenders(room: Room): Creep[] {
    return this.getAllOwned(room)
      .filter((creep: Creep): boolean => (creep.memory as Memory).canFight == true)
      .filter((creep: Creep): boolean => (creep.memory as Memory).action != ATTACK);
  }

  public getByRole(room: Room, role: Role) {
    return this.getAllOwned(room)
      .filter((creep: Creep): boolean => (creep.memory as Memory).role == role);
  }

  public getMoving(room: Room): Creep[] {
    return this.getAllOwned(room)
      .filter((creep: Creep): boolean => (creep.memory as Memory).targetId != '');
  }
}
