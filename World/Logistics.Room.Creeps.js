var GameTick = require("./Logic.GameTick");

/**
 * Creeps in the room.
 */
module.exports = class Creeps extends GameTick {
    /**
     * Reset the state data.
     */
    reset()
    {
        this.creeps = this.game.creeps;
    }

    /**
     * Search for creeps.
     */
    getList()
    {
        return this.game.creeps;
    }
}
