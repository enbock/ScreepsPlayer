var My = require("./index");

var logistics = {};
var military = {};

module.exports.loop = function () {
    _.forEach(Game.spawns, function(spawn) {
        if (! logistics[spawn.name] || true/**dev mode */) {
            //console.log("Create logistic for " + spawn.name);
            logistics[spawn.name] = new My.Logistics(
                [
                    new (require("./Logistics.Builder.Street"))()
                    , new (require("./Logistics.Builder.Extension"))()
                ]
            );
        }
        logistics[spawn.name].Run(spawn);
    });

    _.forEach(Game.rooms, function(room) {
        military[room.name] = new My.Military([
            new (require("./Military.Defend"))()
        ]);
        military[room.name].Run(room);
    });
}