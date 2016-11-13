module.exports = function(myCreep) {
    var creep = myCreep.Me;
    var controller = myCreep.Logistic.Spawn.room.controller;
    if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        myCreep.Move(controller);
    }
};