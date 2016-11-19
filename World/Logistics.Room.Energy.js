var MyCreep = require("./Creep");

/**
 * Energy in the room.
 */
module.exports = class LogisticsRoomEnergy extends require("./Logic.GameTick") {
    /**
     * Create creep list.
     * 
     * @param {Data.Global} game The global game object.
     * @param {Data.Global} room The global current room.
     */
    constructor(game, room)
    {
        super(game);
        this._room = room;
    }

    /**
     * Reset the state data.
     */
    reset()
    {
        this._spots =  undefined;
        this._energyCapacity = undefined;
        this._roomName = this._room.get().name;
    }

    /**
     * Update energy values if needed.
     */
    FindDroppedEnergy()
    {
        this.resetOnTick();
        if (this._spots != undefined) return;

        this._spots = this._room.get().find(
            FIND_DROPPED_RESOURCES
            , {filter: {resourceType: RESOURCE_ENERGY}}
        );

        this._energyCapacity = 0;
        _.forEach(this._spots, resource => {
            this._energyCapacity += resource.amount;
        });
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
     * Get the enery spots.
     */
    get targets()
    {
        this.FindDroppedEnergy();
        return this._spots;
    }

    /**
     * The the avialable capacity.
     */
    get energyCapacity()
    {
        this.FindDroppedEnergy();
        return this._energyCapacity;
    }
}
