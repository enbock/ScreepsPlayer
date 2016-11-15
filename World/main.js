var My = require("./index");

var logistics = {};
var military = {};

module.exports.loop = function () {
    //for(var i in Memory) delete(Memory[i]); return; // clean

    var rooms = Game.rooms;

    if (!rooms) {
        rooms = [];
        _.forEach(Game.spawns, function(spawn) {
            rooms.push(spawn);
        });
    }

    _.forEach(rooms, function(room) {
        logistics[room.name] = new My.Logistics(
            [
                new (require("./Logistics.Builder.Street"))()
                , new (require("./Logistics.Builder.Extension"))()
            ]
        );
        logistics[room.name].Run(room);
        military[room.name] = new My.Military([
            new (require("./Military.Defence"))()
        ]);
        military[room.name].Run(room);
    });
}