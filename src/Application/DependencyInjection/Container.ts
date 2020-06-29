import CreateCreep, {CreepConfiguration} from '../../Command/Action/CreateCreep';
import Executor, {CommandToActionMap} from '../../Command/Executor';
import Queue, {Command} from '../../Command/Queue';
import Directives from '../../Directives';
import HandlerFactory from '../../Directives/HandlerFactory';
import SpawnCreep from '../../Directives/SpawnCreep';
import Role from '../../Screeps/Role';
import SpawnProvider from '../../Screeps/SpawnProvider';

class Container {
  directives: Directives;
  commandQueue: Queue;
  executor: Executor;
  handlerFactory: HandlerFactory;
  spawnProvider: SpawnProvider;

  constructor() {
    this.commandQueue = new Queue();
    this.handlerFactory = new HandlerFactory(
      Game,
      {
        spawnCreep: new SpawnCreep(Game, this.commandQueue)
      }
    );
    this.directives = new Directives(Game, this.handlerFactory);
    this.spawnProvider = new SpawnProvider(Game);

    const creepConfiguration: CreepConfiguration = {
      [Role.Miner]: [MOVE, WORK, CARRY]
    };

    const actions: CommandToActionMap = {
      [Command.CreateCreep]: new CreateCreep(this.spawnProvider, creepConfiguration)
    };

    this.executor = new Executor(
      this.commandQueue,
      actions
    );
  }
}

export default new Container();
