/**
 * A logic which can tell, that we have a new loop.
 */
module.exports = class GameTick {
    /**
     * Create the tick detector.
     * 
     * @param {Data.Global} game Game data cache.
     */
    constructor(game)
    {
        // Tick number on last check.
        this.lastTick = 0;

        // Game accessor.
        this._game = game;
    }

    /**
     * Check if a new round is happened.
     */
    isTick()
    {
        var result, now;

        now = this._game.get().time;
        result = now != this.lastTick;
        this.lastTick = now;

        return result;
    }

    /**
     * Call the reset if new tick.
     */
    resetOnTick()
    {
        if(this.isTick()) this.reset();
    }

    /**
     * Returns game object.
     */
    get game()
    {
        this.resetOnTick()
        return this._game.get();
    }
}