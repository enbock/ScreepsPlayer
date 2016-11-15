var Circle = require("./Math.Circle");

function Builder() {
    Object.call(this);
}
Builder.prototype = Object.create(Object);
module.exports = Builder.prototype.construction = Builder;


Builder.prototype.Run = function(logistic) {
    if (!Memory.Run) Memory.Run = {};
    var last = Memory.Run.Builder * 1;
    var now = (new Date).valueOf();
    if(now - last < 10000) return;
    Memory.Run.Builder = now;
    var buildings = logistic.Room.find(
        FIND_CONSTRUCTION_SITES
        , {filter: function(x) { return x.structureType == STRUCTURE_EXTENSION; }}
    );
    //buildings.forEach(function(b) {b.remove()}); return; // clean
    if(buildings.length >= 2) return;
    var extensions = logistic.Room.find(
        FIND_STRUCTURES
        , {filter: function(x) { return (x instanceof StructureExtension); }}
    );
    var have = extensions.length + buildings.length;
    var max = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][logistic.Room.controller.level];
    if(have >= max) return;
    //console.log("Found", have+"/"+max, "extensions.");
    for(var r = 3; r < 3 + logistic.Room.controller.level * 5; r+=2) {
        var cirlce = Circle(logistic.Spawns[0].pos, r, 2), i;
        for(i=0; i < cirlce.length; i++) {
            var coord = cirlce[i];
            if(
                logistic.Room.createConstructionSite(
                    coord[0], coord[1], STRUCTURE_EXTENSION
                ) == 0
            ) return;
        };
    }
}