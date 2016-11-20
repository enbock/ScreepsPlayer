/**
 * Structure filling action.
 */
module.exports = class CreepActionFillStructures {
    /**
     * Create filling action.
     * 
     * @param {Logistics.Action.Fill.Structures} logistic The logistic.
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
        return "Action.Fill.Structures";
    }

    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    run(creep)
    {
        var targets = this._logistic.targets;
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
            return;
        }
        
        if(creep.$.transfer(target.$, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.move(target.$);
        }

        if(target.$.energy >= target.$.energyCapacity || creep.isEmpty) {
            if(!creep.isEmpty) creep.$.say("Done");
            creep.action = "Action.None";
            return;
        }

    }
}