module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }

    var targets = myCreep.Logistic.Spawns;
    var spawn = _.find(targets, function(x) { 
        return x.id == myCreep.Mem().target; 
    });

    if(! spawn) {
        spawn = _.find(
            targets, function(s) {
                return s.energy < s.energyCapacity;
            }
        );
    }

    if(!spawn || spawn.energy >= spawn.energyCapacity) {
        creep.say("Done.");
        myCreep.SetAction("None");
        delete(myCreep.Mem().target);
        return;
    }

    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        myCreep.Move(spawn);
    }
};