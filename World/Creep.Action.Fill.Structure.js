/**
 * Charge or load buildings.
 */
module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }

    var targets = myCreep.Logistic.ActionTargets.StructureEnergy;
    var oldTarget = _.find(targets, function(x) { 
        return x.target == myCreep.Mem().target; 
    });
    var target = oldTarget ? Game.getObjectById(oldTarget.target) : null;
    if (target && target.progress >= target.progressTotal) {
        creep.say("Done.");
        myCreep.SetAction("None");
        return;
    };

    if(! target) {
        var helper = require("./Logistics.Helper");
        target = Game.getObjectById( 
            helper.FindActionTarget(
                targets, function(id) {
                    var structure = Game.getObjectById(id);
                    return structure 
                        && !(
                            structure instanceof StructureController
                            || structure instanceof StructureSpawn
                        ) 
                        && structure.energy < structure.energyCapacity;
                }
            )
        );
    }

    if (!target) {
        creep.say("Done.");
        myCreep.SetAction("None");
        return;
    };

    myCreep.Mem().target = target.id;
    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        myCreep.Move(target);
    }
};