import SpawnCreep from './Directives/SpawnCreep';
import Role from './Screeps/Role';

export interface DirectiveCatalog {
  spawn:SpawnCreep
}

export interface CreepAmountTarget {
  [role:string]: number
}

export default class Directives {
  private targetCreepAmount: CreepAmountTarget;
  private game: Game;
  private directives: DirectiveCatalog;

  constructor(game:Game, directives:DirectiveCatalog) {
    this.directives = directives;
    this.game = game;
    this.targetCreepAmount = {
      [Role.Miner]: 5
    };
  }

  run():void {
    Object.keys(this.targetCreepAmount).forEach(
      (role:Role):void => {
        this.directives.spawn.run(role, this.targetCreepAmount[role]);
      }
    )
  }
}
