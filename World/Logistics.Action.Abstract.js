/**
 * Abstract action logistic.
 */
module.exports = class Abstract extends require("./Logic.GameTick") {
    /**
     * Reset runtime values.
     */
    reset()
    {
        this._requiredCreeps = undefined;
        this._action = undefined;
    }

    /**
     * Get the needed creep amount.
     * 
     * @return {Object<type:int>}
     */
    get requiredCreeps()
    {
        this.resetOnTick();
        return this._requiredCreeps;
    }

    /**
     * Priority of action.
     */
    get priority()
    {
        return 0xffff;
    }

    /**
     * Action to execute.
     * 
     * @returns {String|Boolean}
     */
    get action()
    {
        this.resetOnTick();
        return this._action;
    }
}