var Circle = require("./Math.Circle");

function Builder() {
    Object.call(this);
}
Builder.prototype = Object.create(Object);
module.exports = Builder.prototype.construction = Builder;


Builder.prototype.Run = function(logistic) {
    var buildings = logistic.Spawn.room.find(
        FIND_CONSTRUCTION_SITES
    );
    //buildings.forEach(function(b) {b.remove()}); return; // clean
    var extensions = logistic.Spawn.room.find(
        FIND_STRUCTURES
        , {filter: function(x) { return (x instanceof StructureExtension); }}
    );
    var have = extensions.length + buildings.length;
    var max = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][logistic.Spawn.room.controller.level];
    //console.log("Found", have+"/"+max, "extensions.");
    for(var r = 3; r < 3 + logistic.Spawn.room.controller.level * 5; r+=2) {
        var cirlce = Circle(logistic.Spawn.pos, r, 2), i;
        for(i=0; i < cirlce.length; i++) {
            var coord = cirlce[i];
            switch(
                logistic.Spawn.room.createConstructionSite(
                    coord[0], coord[1], STRUCTURE_EXTENSION
                )
            ) {
                case OK: have++; break;
                case ERR_RCL_NOT_ENOUGH: return;
                case ERR_FULL: return;
            }
            if (have == max) return;
        };
    }
}