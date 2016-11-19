var Creep = require("./Creep");
/**
 * Action chain for the minimum creeps amount.
 */
module.exports = class LogisticsActionMinimum extends require("./Logistics.Action.Abstract") {
    /**
     * Create the chain.
     *
     * @param {Data.Global} game Global game data.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     */
    constructor (game, roomCreeps)
    {
        super(game);
        this._roomCreeps = roomCreeps;
    }

    /**
     * Reset and reindex requirements.
     */
    reset()
    {
        super.reset();
        this._action = false; // do nothing.

        // which creep we need?
        var types = this._roomCreeps.types;
        console.log(JSON.stringify(types));
        if (!types[Creep.TYPE_MINER]) {
            this._requiredCreeps = {
                [Creep.TYPE_MINER]: 1
            };
        } else if (!types[Creep.TYPE_ENERGY]) {
            this._requiredCreeps = {
                [Creep.TYPE_ENERGY]: 1
            };
        } else {
            this._requiredCreeps = {};
        }
    }

    /**
     * Priority of minimum requirement.
     */
    get priority()
    {
        return 0; // highest
    }
}
