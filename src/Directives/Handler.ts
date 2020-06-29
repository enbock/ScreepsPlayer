import Role from '../Screeps/Role';
import SpawnCreep from './SpawnCreep';

export interface DirectiveCatalog {
  spawnCreep:SpawnCreep
}

export interface CreepAmountTarget {
  [role:string]: number
}

export default class Handler {
  private readonly targetCreepAmount: CreepAmountTarget;
  private game: Game;
  private readonly room: Room;
  private directives: DirectiveCatalog;

  constructor(game:Game, room:Room, directives:DirectiveCatalog) {
    this.room = room;
    this.directives = directives;
    this.game = game;
    this.targetCreepAmount = {
      [Role.Miner]: 5
    };
  }

  run():void {
    Object.keys(this.targetCreepAmount).forEach(
      (role:Role):void => {
        this.directives.spawnCreep.run(this.room, role, this.targetCreepAmount[role]);
      }
    )
  }
}
