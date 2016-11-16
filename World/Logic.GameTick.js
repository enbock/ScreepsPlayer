/**
 * A logic which can tell, that we have a new loop.
 * 
 * @param {Data.Global} game Game data cache.
 */
function GameTick(game)
{
    Object.call(this);

    // Tick number on last check.
    this.lastTick = 0;

    // Game accessor.
    this.game = game;
}
GameTick.prototype = Object.create(Object.prototype);
module.exports = GameTick.prototype.constructor = GameTick;

/**
 * Check if a new round is happened.
 */
GameTick.prototype.isTick = function()
{
    var result, now;

    now = this.game.get().time;
    result = now != this.lastTick;
    this.lastTick = now;

    return result;
}

/**
 * Call the reset if new tick.
 */
GameTick.prototype.resetOnTick = function()
{
    if(this.isTick()) this.reset;
}

/**
 * Resets the cache values in object.
 * @abstract
 */
GameTick.prototype.reset = undefined;