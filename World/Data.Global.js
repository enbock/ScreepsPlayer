/**
 * A class as wrapper to provide runtime injectable data.
 */
module.exports = class GlobalData {
    /**
     * Build the cache.
     * 
     * *Attention:* Run this function on each loop before start the application
     *              loop.
     * 
     * @param {Object} data Screeps game object.
     * 
     * @return {GlobalData}
     */
    reset(data)
    {
        this._data = data;
        return this;
    }

    /**
     * Require the current cached data.
     * 
     * The Screeps Game objects contain the state data, but is works not like
     * a reference. After taking the data never changed, so long you access the 
     * global data object again.
     * 
     * @return {Object}
     */
    get()
    {
        return this._data;
    }
}