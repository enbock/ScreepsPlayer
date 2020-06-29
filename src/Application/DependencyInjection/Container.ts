import ChangeAction from '../../Command/Action/ChangeAction';
import CreateCreep, {CreepConfiguration} from '../../Command/Action/CreateCreep';
import ExecuteAction from '../../Command/Action/ExecuteAction';
import MoveCreep from '../../Command/Action/MoveCreep';
import Executor, {CommandToActionMap} from '../../Command/Executor';
import Queue, {Command} from '../../Command/Queue';
import Directives from '../../Directives';
import DefendHostiles from '../../Directives/DefendHostiles';
import ExecuteCreeps from '../../Directives/ExecuteCreeps';
import {CreepAmountTarget} from '../../Directives/Handler';
import HandlerFactory from '../../Directives/HandlerFactory';
import MoveCreeps from '../../Directives/MoveCreeps';
import SpawnCreeps from '../../Directives/SpawnCreeps';
import BalanceCreeps from '../../Directives/Upgrade/BalanceCreeps';
import CreepProvider from '../../Screeps/CreepProvider';
import Role from '../../Screeps/Role';
import SpawnProvider from '../../Screeps/SpawnProvider';

class Container {
  directives: Directives;
  commandQueue: Queue;
  executor: Executor;
  handlerFactory: HandlerFactory;
  spawnProvider: SpawnProvider;
  creepProvider: CreepProvider;
  creepAmountTarget: CreepAmountTarget;

  constructor() {
    this.spawnProvider = new SpawnProvider(Game);
    this.creepProvider = new CreepProvider();

    this.commandQueue = new Queue();
    this.creepAmountTarget = {
      [Role.Miner]: 1,
      [Role.Defender]: 1
    };
    this.handlerFactory = new HandlerFactory(
      Game,
      {
        spawnCreeps: new SpawnCreeps(this.commandQueue, this.creepProvider),
        defendHostiles: new DefendHostiles(this.commandQueue, this.creepProvider),
        moveCreeps: new MoveCreeps(this.commandQueue, this.creepProvider, Game),
        executeCreeps: new ExecuteCreeps(this.commandQueue, this.creepProvider)
      },
      this.creepAmountTarget,
      [
        new BalanceCreeps(this.creepAmountTarget, this.creepProvider)
      ]
    );
    this.directives = new Directives(Game, this.handlerFactory);

    const creepConfiguration: CreepConfiguration = {
      [Role.Defender]: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, ATTACK],
      [Role.Miner]: [MOVE, WORK, CARRY]
    };

    const actions: CommandToActionMap = {
      [Command.CreateCreep]: new CreateCreep(this.spawnProvider, creepConfiguration),
      [Command.MoveCreep]: new MoveCreep(Game),
      [Command.ChangeAction]: new ChangeAction(),
      [Command.ExecuteAction]: new ExecuteAction(Game)
    };

    this.executor = new Executor(
      this.commandQueue,
      actions
    );
  }
}

export default new Container();
