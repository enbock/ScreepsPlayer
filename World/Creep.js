/**
 * Creep controller.
 * 
 * Contains additional functionality to create and control a creep.
 * 
 * @param {Creep} Native creep object.
 */
function Creep(creep)
{
    Object.call(this);

    // game creep object.
    this.$ = creep;
}
Creep.prototype = Object.create(Object.prototype);
module.exports = Creep.prototype.constructor = Creep;

/**
 * Create a creep for a room.
 * 
 * @param {Spawn} spawn Native spawn object.
 * @param {String[]} setup List of body parts.
 * @param {}
 * 
 * @return int Status code.
 */
Creep.create = function(spawn, setup, memory)
{
    var costs;
     _.forEach(this.setup, function(part) {
        costs += BODYPART_COST[part];
    });

    // checking for costs
    if (spawn.room.energyAvailable < costs) {
        return ERR_NOT_ENOUGH_ENERGY;
    }


}