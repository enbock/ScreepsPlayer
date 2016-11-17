/**
 * Logistic module.
 * 
 * This program part handles the logistic activities of the world.
 * It controlles a room.
 */
module.exports = class Logistics {
    /**
     * Create logistic.
     * 
     * @param {Data.Global} room The current room.
     * @param {Creep.Creator} creepCreator The creep factory.
     */
    constructor(room, creepCreator)
    {
        this.room = room;
        this.creepCreator = creepCreator;
    }

    /**
     * Execute the logistic part.
     */
    run()
    {
        this.reset();
    }

    /**
     * Reset cache properties.
     */
    reset() 
    {
        // spans in room
        this.spawns = undefined;
    }

    /**
     * Get spawns in room.
     * 
     * @return Spawn[]
     */
    getSpawns()
    {
        if (this.spawns === undefined) {
            this.spawns = this.room.get().find(FIND_MY_SPAWNS);
        }
        return spawns;
    }
}