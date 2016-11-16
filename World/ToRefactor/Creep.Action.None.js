module.exports = function(myCreep) {
    var creep = myCreep.Me;
    if(Math.random() <= 0.4 && Math.random() >= 0.6) creep.say("zzZ");
    myCreep.SetAction("Fill.Controller");
};
