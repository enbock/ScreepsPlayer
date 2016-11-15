module.exports = function(myCreep) {
    var creep = myCreep.Me;

    if (myCreep.IsEmpty()) {
        creep.say("Charge");
        myCreep.SetAction("Charge");
    }
    
    var controller = myCreep.Logistic.Room.controller;
    creep.upgradeController(controller);
     myCreep.Move(controller);
};