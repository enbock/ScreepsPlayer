module.exports = function(myCreep) {
    var creep = myCreep.Me;
    var targets = myCreep.Logistic.ActionTargets.Charge;
    var oldTarget = _.find(targets, function(x) { 
        return x.target == myCreep.Mem().target; 
    });
    var source = oldTarget ? Game.getObjectById(oldTarget.target) : null;
    if (source && source.energy == 0) source = null;
    if(myCreep.IsFull()) {
        creep.say("Cargo full.");
        myCreep.SetAction("None");
        return;
    }

    if(! source) {
        var helper = require("./Logistics.Helper");
        source = Game.getObjectById( 
            helper.FindActionTarget(
                targets, function(source) {
                    return Game.getObjectById(source).energy >= 50
                }
            )
        );
    }
    myCreep.Mem().target = source.id;
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        myCreep.Move(source);
    }
};