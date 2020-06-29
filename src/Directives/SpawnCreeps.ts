import {CreateCreepData} from '../Command/Action/CreateCreep';
import Queue, {Command} from '../Command/Queue';
import CreepProvider from '../Screeps/CreepProvider';
import Role from '../Screeps/Role';

interface RequestedCreep {
  [role:string]:number
}

export default class SpawnCreeps {
  requested: RequestedCreep;
  private creepProvider: CreepProvider;
  private commandQueue: Queue;

  constructor(commandQueue: Queue, creepProvider:CreepProvider) {
    this.creepProvider = creepProvider;
    this.commandQueue = commandQueue;

    this.requested = {};
  }

  run(room:Room, role: Role, target: number): void {
    let requested: number = this.requested[role] || 0;

    if (target <= requested) return;

    const screeps:Creep[] = this.creepProvider.getByRole(room, role);
    let current: number = screeps.length;
    if (current > requested) requested = current;
    this.requested[role] = requested;
    if (target <= requested) return;

    this.commandQueue.add(
      {
        command: Command.CreateCreep,
        data: {
          role: role,
          room: room
        } as CreateCreepData
      }
    );
    this.requested[role] = requested + 1;
  }
}

