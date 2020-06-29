import {CreateCreepData} from '../Command/Action/CreateCreep';
import Queue, {Command} from '../Command/Queue';
import Memory from '../Screeps/Memory';
import Role from '../Screeps/Role';

interface RequestedCreep {
  [role:string]:number
}

export default class SpawnCreep {
  requested: RequestedCreep;
  private game: Game;
  private commandQueue: Queue;

  constructor(game: Game, commandQueue: Queue) {
    this.commandQueue = commandQueue;
    this.game = game;

    this.requested = {};
  }

  run(room:Room, role: Role, target: number): void {
    let requested: number = this.requested[role] || 0;

    if (target <= requested) return;

    let current: number = 0;
    Object.keys(this.game.creeps).forEach(
      (name: string): void => {
        const creep: Creep = this.game.creeps[name];
        if ((creep.memory as Memory).role == role) current++;
      }
    );
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

