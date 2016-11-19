/**
 * Mining action.
 */
module.exports = class Mine {
    /**
     * Create mine action.
     * 
     * @param {Logistics.Action.Mine} logistic The mine logistic.
     */
    constructor(logistic, room)
    {
        this._logistic = logistic;
        this._room = room;
    }
    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    run(creep)
    {
        var sources = _.sortBy(this._logistic.sources, "creeps");
        var source = _.find(
            sources 
            , i => i.$.id == creep.$.memory.target
                 && i.$.room == this._room.get()
        );
        if(!source && sources.length > 0) {
            source = sources[0];
            creep.$.memory.target = source.$.id;
            source.creeps++;
        } else if (sources.length == 0) {
            return;
        }
        
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