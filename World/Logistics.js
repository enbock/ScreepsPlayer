/**
 * Logistic module.
 * 
 * This program part handles the logistic activities of the world.
 * It controlles a room.
 * 
 * @param {Data.Global} room The current room.
 * @param {Creep.Creator} creepCreator The creep factory.
 */
function Logistics(room, creepCreator) {
    Object.call(this);

    this.room = room;
    this.creepCreator = creepCreator;
}
Logistics.prototype = Object.create(Object.prototype);
module.exports = Logistics.prototype.constructor = Logistics;

/**
 * Execute the logistic part.
 */
Logistics.prototype.run = function()
{
    this.reset();
    console.log(JSON.stringify(this.room.get()));
}

/**
 * Reset cache properties.
 */
Logistics.prototype.reset = function() 
{
    // spans in room
    this.spawns = undefined;
}

/**
 * Get spawns in room.
 * 
 * @return Spawn[]
 */
Logistics.prototype.getSpawns = function()
{
    if (this.spawns === undefined) {
        this.spawns = this.room.get().find(FIND_MY_SPAWNS);
    }
    return spawns;
}

