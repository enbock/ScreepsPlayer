import Handler, {CreepAmountTarget, DirectiveCatalog, UpgradeDirective} from './Handler';

export default class HandlerFactory {
  private readonly game: Game;
  private readonly targetCreepAmount: CreepAmountTarget;
  private readonly upgrades: UpgradeDirective[];
  private readonly directives: DirectiveCatalog;

  constructor(
    game: Game,
    directives: DirectiveCatalog,
    creepAmountTarget: CreepAmountTarget,
    upgrades: UpgradeDirective[]
  ) {
    this.targetCreepAmount = creepAmountTarget;
    this.upgrades = upgrades;
    this.game = game;
    this.directives = directives;
  }

  create(room: Room): Handler {
    return new Handler(this.game, room, this.directives, this.targetCreepAmount, this.upgrades);
  }
}
