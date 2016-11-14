var Circle = require("./Math.Circle");

function Builder() {
    Object.call(this);
}
Builder.prototype = Object.create(Object);
module.exports = Builder.prototype.construction = Builder;


Builder.prototype.Run = function(logistic) {
    var extensions = logistic.Spawn.room.find(FIND_STRUCTURES, {filter: function(x) { return x instanceof StructureExtension; }});
    console.log("Found", extensions.length, "extensions.");

    for(var r = 3; r < 3 + logistic.Spawn.room.controller.level * 5; r+=2) {
        var cirlce = Circle(logistic.Spawn.pos, r);
    }
}