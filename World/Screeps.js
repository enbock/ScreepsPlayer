/**
 * Main application.
 */
module.exports = class Screeps {
    /**
     * Create application and store logistic object.
     * 
     * @param {Logistics} logistic Logistic module.
     */
    constructor(logistic)
    {
        //logitic module
        this.logistic = logistic;
    }

    /**
     * Jump in point for a application loop.
     */
    run()
    {
        this.logistic.run();
    }
}