module.exports = function(myCreep) {
    var creep = myCreep.Me;
    var targets = myCreep.Logistic.ActionTargets.Mine;
    var oldTarget = _.find(targets, function(x) { 
        return x.target == myCreep.Mem().target; 
    });
    var source = oldTarget ? Game.getObjectById(oldTarget.target) : null;
    if(myCreep.IsFull()) {
        for(var resourceType in creep.carry) {
            creep.drop(resourceType);
        }
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