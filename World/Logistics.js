/**
 * Logistic module.
 * 
 * This program part handles the logistic activities of the world.
 * It controlles a room.
 */
module.exports = class Logistics extends require("./Logic.GameTick") {
    /**
     * Create logistic.
     * 
     * @param {Data.Global} room The current room.
     */
    constructor(game, room)
    {
        super(game);
        this._room = room;
    }

    /**
     * Execute the logistic part.
     */
    run()
    {
        this.resetOnTick();
    }

    /**
     * Reset cache properties.
     */
    reset() 
    {
        // spans in room
        this._spawns = undefined;
    }

    /**
     * Get spawns in room.
     * 
     * @return Spawn[]
     */
    get spawns()
    {
        this.resetOnTick();
        if (this._spawns === undefined) {
            this._spawns = this._room.get().find(FIND_MY_SPAWNS);
        }
        return this._spawns;
    }
}