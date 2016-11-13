module.exports = function(myCreep) {
    var creep = myCreep.Me;
    var spawn = myCreep.Logistic.Spawn;
    if(spawn.energy >= spawn.energyCapacity) {
        creep.say("Done.");
        myCreep.SetAction("None");
        return;
    }

    /*
    var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
    });
    */

    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        myCreep.Move(spawn);
    }
};