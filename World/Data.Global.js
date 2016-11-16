/**
 * Access to a screeps game object.
 */
function GlobalData()
{
    Object.call(this);
}
GlobalData.prototype = Object.create(Object.prototype);
module.exports = GlobalData.prototype.constructor = GlobalData;

/**
 * Build the cache.
 * 
 * *Attention:* Run this function on each loop before start the application
 *              loop.
 * 
 * @param {Object} data Screeps game object.
 */
GlobalData.prototype.reset = function(data)
{
    this.data = data;
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
GlobalData.prototype.get = function()
{
    return this.data;
}