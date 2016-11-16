/**
 * Main application.
 * 
 * @param {Logistics} logistic Logistic module.
 */
function Screeps(logistic)
{
    Object.call(this);

    //logitic module
    this.logistic = logistic;
}
Screeps.prototype = Object.create(Object.prototype);
module.exports = Screeps.prototype.constructor = Screeps;

/**
 * Jump in point for a application loop.
 */
Screeps.prototype.run = function() {
    this.logistic.run();
}