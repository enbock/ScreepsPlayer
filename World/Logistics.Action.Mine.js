var Creep = require("./Creep");
/**
 * Action chain for the mining creeps amount.
 */
module.exports = class LogisticsActionMine extends require("./Logistics.Action.Abstract") {
    /**
     * Create the chain.
     *
     * @param {Data.Global} game Global game data.
     * @param {Data.Global} room Global room data.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
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
        this._action = false; // do nothing.

        this._sources = this.UpdateMines();

        var need = 1;

        // check, that need is under transporters
        var energyCreeps = 0;
        var minerCreeps = 0;
        _.forEach(this._roomCreeps.creeps, creep => {
            if(creep.$.memory.type == Creep.TYPE_ENERGY) energyCreeps++;
            if(creep.$.memory.type == Creep.TYPE_MINER) minerCreeps++;
        });
        if(minerCreeps < energyCreeps) {
            _.forEach(this.sources, source => {
                need += source.max;
            });
        }

        this._requiredCreeps = {
            [this._action2Type[this]]: need
        };
    }

    /**
     * Priority of minimum requirement.
     */
    get priority()
    {
        return 5;
    }

    /**
     * Get action name.
     *
     * @returns {string}
     */
    toString() {
        return "Action.Mine";
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
    UpdateMines() {
        var sources = []
            , room = this._room.get()
        ;
        this._lastRoom = room;

        _.forEach(room.find(FIND_SOURCES), source => {
            var item = {
                $: source
                , target: source.id
                , max: 0
                , creeps: 0
            };
            var rx = source.pos.x;
            var ry = source.pos.y;
            for(var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    if (x == 0 && y == 0) continue;
                    var terrain = room.lookForAt(LOOK_TERRAIN, rx + x, ry + y);
                    if(terrain == "plain") {
                        item.max++;
                    }
                }
            }
            _.forEach(this._roomCreeps.creeps, function(creep) {
                if (creep.$.memory.target == item.target) item.creeps++;
            });
            sources.push(item);
        });

        return sources;
    }

    /**
     * Return current sources.
     */
    get sources()
    {
        this.resetOnTick();
        return this._sources;
    }
}
