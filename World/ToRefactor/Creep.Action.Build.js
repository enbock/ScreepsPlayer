module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }

    var targets = myCreep.Logistic.ActionTargets.Build;
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
                    var build = Game.getObjectById(id);
                    return build && build.progress < build.progressTotal;
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
    var result = creep.build(target);
    if(result == ERR_NOT_IN_RANGE || result == OK) {
        myCreep.Move(target);
    }
};