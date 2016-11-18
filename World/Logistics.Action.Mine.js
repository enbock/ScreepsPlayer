var Creep = require("./Creep");
/**
 * Action chain for the mining creeps amount.
 */
module.exports = class Mine extends require("./Logistics.Action.Abstract") {
    /**
     * Create the chain.
     *
     * @param {Data.Global} game Global game data.
     * @param {Data.Global} room Global room data.
     * @param {Logistics.Room.Creeps} roomCreeps The creeps information.
     */
    constructor (game, room, roomCreeps)
    {
        super(game);
        this._room = room;
        this._roomCreeps = roomCreeps;
    }

    /**
     * Reset and reindex requirements.
     */
    reset()
    {
        super.reset();
        this._action = false; // do nothing.

        var need = 0;
        _.forEach(this.sources, source => {
            need += source.max;
        });
        this._requiredCreeps = {
            [Creep.TYPE_MINER]: need
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
     * Find sources once on start the context.
     * @context program
     */
    UpdateMines() {
        if (this._sources) return this._sources;
        var sources = []
            , room = this._room.get()
        ;

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
            _.forEach(Game.creeps, function(creep) {
                if (creep.memory.target == item.target) item.creeps++;
            });
            sources.push(item);
        });

        this._sources = sources;
        return this._sources;
    }

    /**
     * Return current sources.
     */
    get sources()
    {
        return this.UpdateMines();
    }
}
