/**
 * Main application.
 */
module.exports = class Screeps {
    /**
     * Create application and store logistic object.
     * 
     * @param {Logistics} logistic Logistic module.
     * @param {Creep.Execute.Action} actionExecutor Action runner.
     */
    constructor(logistic, actionExecutor)
    {
        //logitic module
        this._logistic = logistic;
        this._actionExecutor = actionExecutor;
    }

    /**
     * Jump in point for a application loop.
     */
    run()
    {
        this._logistic.run();
        this._actionExecutor.run();
    }
}