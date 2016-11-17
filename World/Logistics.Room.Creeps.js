var GameTick = require("./Logic.GameTick");
var MyCreep = require("./Creep");

/**
 * Creeps in the room.
 */
module.exports = class Creeps extends GameTick {
    /**
     * Create creep list.
     * 
     * @param {Data.Global} game The global game object.
     * @param {Data.Global} room The global current room.
     */
    constructor(game, room)
    {
        super(game);
        this._room = room;
    }

    /**
     * Reset the state data.
     */
    reset()
    {
        this._types =  undefined;
        this._list = undefined;
    }

    /**
     * Search for creeps.
     * 
     * @return {Creep[]}
     */
    get creeps()
    {
        this.resetOnTick();
        if (this._list === undefined) {
            this._list = {}
            for(var creep in _.filter(
                    this.game.creeps
                    , creep => creep.memory.homeRoom = this._room.get().name
                ).entries()
            ) {
                this._list[creep.name] = new MyCreep(creep);
            }
        }

        return this._list;
    }

    /**
     * Get types of the creeps.
     */
    get types()
    {
        this.resetOnTick();
        if (this._types === undefined) {
            this._types = _.countBy(this.creeps, "$.memory.type");
        }
        return this._types;
    }
}
