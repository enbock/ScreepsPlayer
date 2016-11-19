/**
 * The action handler.
 * 
 * Controlls, which of the extistent creeps service which action.
 */
module.exports = class ActionHandler {
    /**
     * Create the handler.
     * 
     * @param {Logistics.Action[]} actionChain List of action to do.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     * @param {Object<string:string>} action2type Map from action to worker type
     */
    constructor(actionChain, roomCreeps, action2type)
    {
        this._actionChain = actionChain;
        this._roomCreeps = roomCreeps;
        this._action2type = action2type;
    }

    /**
     * Main logic to manage the actions.
     */
    assignActions()
    {
        var assignments = this.countAssignedCreeps();
        var unassigned  = assignments["Action.None"];
        delete(assignments["Action.None"]);

        console.log(
            unassigned.count
            , "lazy creep"
            + (unassigned.count > 1 || unassigned.count == 0 ? "s" : "")
        );
        
        var sorted  = _.sortBy(assignments, action => action.priority);
        var rsorted = _.sortBy(assignments, action => action.priority).reverse();

        _.forEach(sorted, action => {
            var max = action.unit.requiredCreeps[this._action2type[action.name]];
            //console.log(action.name, "need", max, "have", action.count);
            if(action.count >= max) return;

            var creeps = this.requestFreeCreeps(
                unassigned
                , max - action.count
                , this._action2type[action.name]
            );
            this.assign(creeps, action.name);

            //TODO do here the repriorizing
        });

    }

    /**
     * Count, the current assigned creeps.
     * 
     * @returns {Object<Logistics.Action>} 
     */
    countAssignedCreeps()
    {
        var assignments = {
            ["Action.None"]: {
                name: "Action.None"
                , priority: 0xffff
                , count: 0
                , unit: null
            }
        };
        // reset
        _.forEach(this._actionChain, unit => assignments[unit.toString()] = {
            name: unit.toString()
            , priority: unit.priority
            , count: 0
            , unit: unit
        });

        _.forEach(this._roomCreeps.creeps, creep => {
            assignments[creep.action].count ++; 
        });

        return assignments;
    }

    /**
     * Take creep from unassigned list.
     * 
     * @param {Object} unassigned Status of unassigned creeps.
     * @param {Number} amount Amount of requesred creeps.
     * @param {String} type Creep type.
     */
    requestFreeCreeps(unassigned, amount, type)
    {
        var creeps = _.filter(
            this._roomCreeps.creeps
            , creep => 
                creep.action == "Action.None"
                && creep.$.memory.type == type
        );

        return creeps.slice(0, amount);
    }

    /**
     * Assign creeps to an action.
     * 
     * @param {Creep[]} List of creeps to assign.
     * @param {String} action Action command.
     */
    assign(creeps, action)
    {
        _.forEach(creeps, creep => creep.action = action);
    }
}