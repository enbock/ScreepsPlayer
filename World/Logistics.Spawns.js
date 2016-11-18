/**
 * List of current spawns.
 * 
 * This program part handles the logistic activities of the world.
 * It controlles a room.
 */
module.exports = class Spawns extends require("./Logic.GameTick") {
    /**
     * Create logistic.
     * 
     * @param {Data.Global} game The global game object.
     * @param {Data.Global} room The current room.
     */
    constructor(game, room)
    {
        super(game);
        this._room = room;
    }

    /**
     * Reset cache properties.
     */
    reset() 
    {
        // spans in room
        this._spawns = undefined;
        this._roomName = this._room.get().name;
    }

    /**
     * Get spawns in room.
     * 
     * @return Spawn[]
     */
    get()
    {
        this.resetOnTick();
        if (this._spawns === undefined) {
            this._spawns = this._room.get().find(FIND_MY_SPAWNS);
        }
        return this._spawns;
    }

    /**
     * Check if reset is needed.
     */
    resetOnTick()
    {
        super.resetOnTick();
        if (this._roomName != this._room.get().name) this.reset();
    }
}