import CreateCreep, {CreepConfiguration} from '../../Command/Action/CreateCreep';
import Executor, {CommandToActionMap} from '../../Command/Executor';
import Queue, {Command} from '../../Command/Queue';
import Directives from '../../Directives';
import SpawnCreep from '../../Directives/SpawnCreep';
import Role from '../../Screeps/Role';

class Container {
  directives: Directives;
  commandQueue: Queue;
  executor: Executor;

  constructor() {
    this.commandQueue = new Queue();
    this.directives = new Directives(
      Game, {
        spawn: new SpawnCreep(Game, this.commandQueue)
      }
    );

    const creepConfiguration: CreepConfiguration = {
      [Role.Miner]: [MOVE, WORK, CARRY]
    };

    const actions: CommandToActionMap = {
      [Command.CreateCreep]: new CreateCreep(Game.spawns.Spawn1, creepConfiguration)
    };

    this.executor = new Executor(
      this.commandQueue,
      actions
    );
  }
}

export default new Container();
