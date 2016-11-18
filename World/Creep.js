/**
 * Creep controller.
 *
 * Contains additional functionality to create and control a creep.
 */
class Creep {
    /**
     * Create object.
     *
     * @param {Game} game Native game object.
     * @param {Creep} creep Native creep object.
     */
    constructor(game, creep)
    {
        Object.call(this);

        // game creep object.
        this.$ = creep;
        this._game = game;
    }

    /**
     * String value of the creep.
     */
    toString()
    {
        return "[Creep " + this.$.memory.type + " " + this.$.name + "]";
    }

    /**
     * Set new creep action.
     *
     * @param {String} action
     */
    set action(action)
    {
        this.$.memory.action = action;
    }

    /**
     * Get action of creep.
     *
     * @returns {String}
     */
    get action()
    {
        if(!this.$.memory.action) return "Action.None";
        return this.$.memory.action;
    }
}

Creep.TYPE_WORKER = "worker";
Creep.TYPE_MINER = "miner";

module.exports = Creep;
