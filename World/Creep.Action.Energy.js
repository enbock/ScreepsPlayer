/**
 * Energy taking action.
 */
module.exports = class Energy {
    /**
     * Create energy action.
     * 
     * @param {Logistics.Action.Energy} logistic The logistic.
     */
    constructor(logistic, room)
    {
        this._logistic = logistic;
        this._room = room;
    }

    /**
     * Get action name.
     * 
     * @returns {String}
     */
    toString()
    {
        return "Action.Energy";
    }

    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    run(creep)
    {
        var targets = _.sortBy(this._logistic.targets, "creeps");
        var target = _.find(
            targets 
            , i => i.$.id == creep.$.memory.target
                 && i.$.room == this._room.get()
        );
        if(!target && targets.length > 0) {
            target = targets[0];
            creep.$.memory.target = target.$.id;
            target.creeps++;
        } else if (targets.length == 0) {
            creep.action = "Action.None";
            return;
        }
        
        if(creep.$.pickup(target.$) == ERR_NOT_IN_RANGE) {
            creep.move(target.$);
        }

        if(creep.isFull) {
            creep.$.say("Cargo full");
            creep.action = "Action.None";
            return;
        }

    }
}