export default class SpawnProvider {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  getByRoom(room:Room) {
    const spawns:StructureSpawn[] = [];
    for (let spawnName in this.game.spawns) {
      const spawn:StructureSpawn = this.game.spawns[spawnName];
      if (spawn.room != room) continue;
      spawns.push(spawn);
    }

    return spawns;
  }
}
