var MyCreep = require("./Creep");

/**
 * Creeps in the room.
 */
module.exports = class Creeps extends require("./Logic.GameTick") {
    /**
     * Create creep list.
     * 
     * @param {Data.Global} game The global game object.
     * @param {Data.Global} room The global current room.
     * @param {Creep.Creator} creepCreator The creep factory.
     */
    constructor(game, room, creepCreator)
    {
        super(game);
        this._room = room;
        this.creepCreator = creepCreator;
    }

    /**
     * Reset the state data.
     */
    reset()
    {
        this._types =  undefined;
        this._list = undefined;
        this._amount = undefined;
        this._roomName = this._room.get().name;
    }

    /**
     * Search for creeps.
     * 
     * @return {Object<String:Creep>}
     */
    get creeps()
    {
        this.resetOnTick();
        if (this._list === undefined) {
            var creeps = _.filter(
                this.game.creeps
                , creep => creep.memory.homeRoom == this._room.get().name
            );
            this._list = {}
            this._amount = creeps.length;
            for(let creep of creeps.entries()) {
                this._list[creep[1].name] = this.creepCreator.factory(creep[1]);
            }
        }
        return this._list;
    }

    /**
     * Get types of the creeps.
     * 
     * @returns {Object<String:int>} Type and count map. 
     */
    get types()
    {
        this.resetOnTick();
        if (this._types === undefined) {
            this._types = _.countBy(this.creeps, "$.memory.type");
        }
        return this._types;
    }

    /**
     * Amount of creeps in the room.
     * 
     * @returns {int}
     */
    get amount()
    {
        this.creeps; // refresh cache if needed
        return this._amount;
    }

    /**
     * Check if reset is needed.
     */
    resetOnTick()
    {
        super.resetOnTick();
        if (this._roomName != this._room.get().name) this.reset();
    }
}
