import Handler, {DirectiveCatalog} from './Handler';

export default class HandlerFactory {
  private game: Game;
  private directives: DirectiveCatalog;

  constructor(game: Game, directives: DirectiveCatalog) {
    this.game = game;
    this.directives = directives;
  }

  create(room: Room): Handler {
    return new Handler(this.game, room, this.directives);
  }
}
