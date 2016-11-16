/**
 * Main application.
 */
function Screeps()
{
    Object.call(this);
}
Screeps.prototype = Object.create(Object.prototype);
module.exports = Screeps.prototype.constructor = Screeps;

/**
 * Jump in point for a application loop.
 */
Screeps.prototype.run = function() {
}