/**
 * Population logistic module.
 */
module.exports = class Population {
    /**
     * Create module.
     *
     * @param {Object} receipts Creep receipts.
     * @param {Creep.Creator} creator Creep factory.
     * @param {Logistics.Spawns} spawns List of available spawns.
     */
    constructor(receipts, creator, spawns) {
        this.caseIgnoreLimit = x => x.priority == 0;
        this._receipts = receipts;
        this._creator = creator;
        this._spawns = spawns;
    }

    /**
     * Create/Spawn a creep.
     *
     * @param {Logistics.Action} action The action with the requirement.
     *
     * @returns {boolean} true when population is high, creep spawn or no new creep should spawn.
     */
    create(action)
    {
        if(this._spawns.get().length == 0) return false;   
        if(this.caseIgnoreLimit(action)) return this.forceSpawn(action);

        return this.spawn(action);
    }

    /**
     * Spawn a creep with extended receipt search.
     *
     * @returns {boolean} True if spawn need.
     */
    forceSpawn(action)
    {
        var level = this._spawns.get()[0].room.controller.level;
        var workers = Object.keys(action.requiredCreeps);
        var respawns = false;
        for(let i of workers.entries()) {
            var type = i[1];
            var result = -1;

            while(level > 1 || !this._receipts[type][level]) level --;
            do {
                respawns = true;
                result = this._creator.spawn(
                    this._spawns.get()[0]
                    , this._receipts[type][level]
                    , type
                );
                level --;
            } while(result != OK && level > 0);
            if(result == OK) return true; // creep created
        }
        //console.log("spawn for", action, respawns);
        return respawns;
    }

    /**
     * Spawn a creep.
     *
     * @returns {boolean} True if spawn success.
     */
    spawn(action)
    {
        var level = this._spawns.get()[0].room.controller.level;
        var workers = Object.keys(action.requiredCreeps);
        for(let i of workers.entries()) {
            var type = i[1];
            var result = -1;

            while(level > 1 || !this._receipts[type][level]) level --;
            result = this._creator.spawn(
                this._spawns.get()[0]
                , this._receipts[type][level]
                , type
            );
            level --;
            if(result == OK) return true; // creep created
        }
        //console.log("spawn for", action, respawns);
        return false;
    }
}
