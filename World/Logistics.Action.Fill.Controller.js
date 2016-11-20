var Creep = require("./Creep");
/**
 * Action logitic to refill controller.
 */
module.exports = class LogisticsActionFillController extends require("./Logistics.Action.Abstract") {
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
        this._controller = undefined;
        this._targets = this.UpdateStructures();
        this._requiredCreeps = this.MakeRequirement();
    }

    /**
     * Priority of minimum requirement.
     */
    get priority()
    {
        return this._controller === undefined 
            ? 0xfff 
            : 10 * (this._controller.level - 1) + 1 // reduce prio on high level
    }

    /**
     * Get action name.
     *
     * @returns {string}
     */
    toString() {
        return "Action.Fill.Controller";
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
        var controller = this._room.get().controller;

        if(controller && controller.my && controller.progressTotal > 0) {
            var item = {
                $: controller
                , target: controller.id
                , creeps: 0
            };
            _.forEach(this._roomCreeps.creeps, function(creep) {
                if (creep.$.memory.target == item.target) item.creeps++;
            });
            targets.push(item);

            this._controller = controller;
        }            
        
        return targets;
    }

    /**
     * Find requirements.
     */
    MakeRequirement() {
        return {
            [this._action2Type[this]]: 
                this._controller === undefined 
                ? 0 
                : this._controller.level * 4
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
