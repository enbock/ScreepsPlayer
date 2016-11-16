var GameTick = require("./Logic.GameTick");

/**
 * Creeps in the room.
 * 
 * @param {Data.Global} game Game data cache.
 */
function Creeps(game)
{
    GameTick.call(this, game);
}
Creeps.prototype = Object.create(GameTick.prototype);
module.exports = Creeps.prototype.constructor = Creeps;

/**
 * Reset the state data.
 */
Creeps.prototype.reset = function()
{
    
}

/**
 * Search for creeps.
 */
Creeps.prototype.getList = function()
{
    
}
