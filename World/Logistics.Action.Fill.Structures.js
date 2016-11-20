var Creep = require("./Creep");
/**
 * Action logitic to refill structures.
 * Searches for energy which need and consumer energy.
 */
module.exports = class LogisticsActionFillStructures extends require("./Logistics.Action.Abstract") {
    /**
     * Create the action logitic.
     *
     * @param {Data.Global} game Global game data.
     * @param {Data.Global} room Global room data.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     * @param {Object} action2Type Action map. 
     */
    constructor (game, room, roomCreeps, action2Type)
    {
        super(game);
        this._room = room;
        this._roomCreeps = roomCreeps;
        this._action2Type = action2Type;
    }

    /**
     * Reset and reindex requirements.
     */
    reset()
    {
        super.reset();
        this._roomName = this._room.get().name;
        this._targets = this.UpdateStructures();
        this._requiredCreeps = this.MakeRequirement();
    }

    /**
     * Priority of minimum requirement.
     */
    get priority()
    {
        return 0xfb;
    }

    /**
     * Get action name.
     *
     * @returns {string}
     */
    toString() {
        return "Action.Fill.Structures";
    }

    /**
     * Check if reset is needed.
     */
    resetOnTick()
    {
        super.resetOnTick();
        if (this._roomName != this._room.get().name) this.reset();
    }

    /**
     * Find sources once on start the context.
     * @context program
     */
    UpdateStructures() {
        var targets = []
            , room = this._room.get()
        ;

        const orders = {
            [STRUCTURE_SPAWN]: 0,
            [STRUCTURE_TOWER]: 2,
            [STRUCTURE_EXTENSION]: 4
        }

        _.forEach(
            room.find(
                FIND_MY_STRUCTURES,
                {
                    filter: 
                        structure => orders[structure.structureType] !== undefined 
                        && structure.energy < structure.energyCapacity
                }
            ), target => {
                var item = {
                    $: target
                    , target: target.id
                    , creeps: 0
                    , order: orders[target.structureType]
                };
                _.forEach(this._roomCreeps.creeps, function(creep) {
                    if (creep.$.memory.target == item.target) item.creeps++;
                });
                targets.push(item);
            }
        );
        
        targets = _.sortBy(targets, target => target.order);

        return targets;
    }

    MakeRequirement() {
        return {
            [this._action2Type[this]]: this.targets.length * 3
        };
    }

    /**
     * Return current sources.
     */
    get targets()
    {
        this.resetOnTick();
        return this._targets;
    }
}
