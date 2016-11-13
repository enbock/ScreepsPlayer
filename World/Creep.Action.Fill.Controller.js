module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }
    
    var controller = myCreep.Logistic.Spawn.room.controller;
    if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        myCreep.Move(controller);
    }
};