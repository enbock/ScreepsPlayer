import Handler from './Directives/Handler';
import HandlerFactory from './Directives/HandlerFactory';

export default class Directives {
  handlers: Handler[];
  private factory: HandlerFactory;
  private game: Game;

  constructor(game: Game, factory: HandlerFactory) {
    this.game = game;
    this.factory = factory;
    this.handlers = [];
  }

  initialize(): void {
    for (let roomName in this.game.rooms) {
      const room = this.game.rooms[roomName];
      this.handlers.push(this.factory.create(room));
    }
  }

  run():void {
    this.handlers.forEach((handler: Handler) => handler.run());
  }
}
