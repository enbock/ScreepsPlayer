/**
 * The action executor.
 * 
 * Run the on creep assigned actions.
 */
module.exports = class Executor {
    /**
     * Create executor.
     * 
     * @param {Creep.Action[]} actionList List of action to do.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     */
    constructor(actionList, roomCreeps)
    {
        this._actionList = {};
        actionList.forEach(action => {
            this._actionList[action.toString()] = action;
        });
        this._roomCreeps = roomCreeps;
    }

    /**
     * Execute the actions of the creeps.
     */
    run()
    {
        _.forEach(this._roomCreeps.creeps, creep => {
            var action = creep.action;
            if (!this._actionList[action]) action = "Action.None";
            this._actionList[action].run(creep);
        });
    }
}