module.exports = function(myCreep) {
    var creep = myCreep.Me;
    var targets = myCreep.Logistic.ActionTargets.Charge;
    var oldTarget = _.find(targets, function(x) { 
        return x.target == myCreep.Mem().target; 
    });
    var source = oldTarget ? Game.getObjectById(oldTarget.target) : null;
    if(myCreep.IsFull() || (!source && !myCreep.IsEmpty())) {
        if(myCreep.IsFull()) creep.say("Cargo full.");
        myCreep.SetAction("None");
        return;
    }

    if(! source) {
        var helper = require("./Logistics.Helper");
        source = Game.getObjectById( 
            helper.FindActionTarget(
                targets, function(source) {
                    return Game.getObjectById(source).amount > 0
                }
            )
        );
    }
    if (!source) {
        //creep.say("!@#");
        creep.move(Math.round(Math.random()*7)+1);
        return;
    }
    myCreep.Mem().target = source.id;
    if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
        myCreep.Move(source);
    }
};