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
     * @param {Logistics.Room.Creeps} creepList The list of creeps in room.
     */
    constructor(room, creepCreator, creepList)
    {
        this.room = room;
        this.creepCreator = creepCreator;
        this.creepList = creepList;
    }

    /**
     * Execute the logistic part.
     */
    run()
    {
        this.reset();
        console.log(JSON.stringify(this.creepList.getList()));
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