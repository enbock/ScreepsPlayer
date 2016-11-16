/**
 * Screep World bootstrap file.
 */

// Loading permanent objects in program context.
var container = new (require("./Core.Container"))(
    require("./config")
);

/**
 * Screeps loop invoker.
 */
module.exports.loop = function () {
    //for(var i in Memory) delete(Memory[i]); return; // clean
    console.log("---------------------------------------------------------");
    container.get("data_game").reset(Game);
    container.get("data_memory").reset(Memory);
    _.forEach(Game.rooms, function(room) {
        container.get("data_room").reset(room);
        container.get("screeps").run();
    });
}