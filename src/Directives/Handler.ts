import Role from '../Screeps/Role';
import DefendHostiles from './DefendHostiles';
import ExecuteCreeps from './ExecuteCreeps';
import MoveCreeps from './MoveCreeps';
import SpawnCreeps from './SpawnCreeps';

export interface DirectiveCatalog {
  spawnCreeps: SpawnCreeps
  moveCreeps: MoveCreeps
  defendHostiles: DefendHostiles
  executeCreeps: ExecuteCreeps
}

export interface CreepAmountTarget {
  [role: string]: number
}

export interface UpgradeDirective {
  run(room: Room): void
}

export default class Handler {
  private readonly targetCreepAmount: CreepAmountTarget;
  private game: Game;
  private upgrades: UpgradeDirective[];
  private readonly room: Room;
  private directives: DirectiveCatalog;

  constructor(
    game: Game,
    room: Room,
    directives: DirectiveCatalog,
    creepAmountTarget: CreepAmountTarget,
    upgrades: UpgradeDirective[]
  ) {
    this.upgrades = upgrades;
    this.room = room;
    this.directives = directives;
    this.game = game;
    this.targetCreepAmount = creepAmountTarget;
  }

  run(): void {
    this.executeUpgrades();

    Object.keys(this.targetCreepAmount).forEach(
      (role: Role): void => {
        this.directives.spawnCreeps.run(this.room, role, this.targetCreepAmount[role]);
      }
    );

    this.directives.defendHostiles.run(this.room);
    this.directives.moveCreeps.run(this.room);

    this.directives.executeCreeps.run(this.room);
  }

  private executeUpgrades(): void {
    this.upgrades.forEach((upgrade: UpgradeDirective) => upgrade.run(this.room));
  }
}
