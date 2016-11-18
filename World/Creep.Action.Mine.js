/**
 * Mining action.
 */
module.exports = class Mine {
    /**
     * Create mine action.
     * 
     * @param {Logistics.Action.Mine} logistic The mine logistic.
     */
    constructor(logistic)
    {
        this._logistic = logistic;
    }
    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    run(creep)
    {
        var sources = _.sortBy(this._logistic.sources, "creeps");
        var source = _.find(source, i => i.target == creep.$.memory.target);
        if(!source && sources.length > 0) {
            source = sources[0];
            creep.$.memory.target = source.target;
            source.creeps++;
        } else 
            return;
        
        if(creep.$.harvest(source.$) == ERR_NOT_IN_RANGE) {
            creep.move(source.$);
        }

        if(creep.isFull) {
        for(var resourceType in creep.$.carry) {
            creep.$.drop(resourceType);
        }
        return;
    }

    }

    /**
     * Get action name.
     * 
     * @returns {String}
     */
    toString()
    {
        return "Action.Mine";
    }
}