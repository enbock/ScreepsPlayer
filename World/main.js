/**
 * Screep World bootstrap file.
 */
var container = new (require("./Core.Container"))(
    require("./config")
);

/**
 * Screeps loop invoker.
 */
module.exports.loop = function () {
    //for(var i in Memory) delete(Memory[i]); return; // clean
    console.log("---------------------------------------------------------");
    container.get("screeps").run();
}