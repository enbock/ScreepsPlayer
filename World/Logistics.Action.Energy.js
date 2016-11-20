var Creep = require("./Creep");
/**
 * Action logitic to take energy drops.
 */
module.exports = class LogisticsActionEnergy extends require("./Logistics.Action.Abstract") {
    /**
     * Create the action logistic.
     *
     * @param {Data.Global} game Global game data.
     * @param {Data.Global} room Global room data.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     * @param {Logistics.Room.Energy} roomEnergy The energy information.
     * @param {Object} action2Type Action map. 
     */
    constructor (game, room, roomCreeps, roomEnergy, action2Type)
    {
        super(game);
        this._room = room;
        this._roomCreeps = roomCreeps;
        this._roomEnergy = roomEnergy;
        this._action2Type = action2Type;
    }

    /**
     * Reset and reindex requirements.
     */
    reset()
    {
        super.reset();
        this._roomName = this._room.get().name;
        this._targets = this.UpdateEnegry();
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
        return "Action.Energy";
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
    UpdateEnegry() {
        var targets = []
            , room = this._room.get()
        ;

        _.forEach(
            this._roomEnergy.targets, target => {
                var item = {
                    $: target
                    , target: target.id
                    , max: 0
                    , creeps: 0
                };
                _.forEach(this._roomCreeps.creeps, function(creep) {
                    if (creep.$.memory.target == item.target) item.creeps++;
                });
                targets.push(item);
            }
        );

        return targets;
    }

    MakeRequirement() {
        var requirements = {};
        var emptyCreeps = _.filter(
            this._roomCreeps.creeps,
            creep => creep.$.memory.type == this._action2Type[this]
        );

        var haveCreeps = emptyCreeps ? emptyCreeps.length : 0;
        var maxCreeps = Math.round(this._roomEnergy.energyCapacity / 200); //TODO AVG transporter
        
        if (haveCreeps < maxCreeps) {
            requirements[this._action2Type[this]] = maxCreeps - haveCreeps;
        }

        return requirements;
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
