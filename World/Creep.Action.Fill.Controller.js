module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }
    
    var controller = myCreep.Logistic.Room.controller;
    var result = creep.upgradeController(controller);
    if(result == ERR_NOT_IN_RANGE || result == OK) {
        myCreep.Move(controller);
    }
};