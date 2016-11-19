/**
 * Logistic module.
 *
 * This program part handles the logistic activities of the world.
 * It controlles a room.
 */
module.exports = class Logistics /*extends require("./Logic.GameTick")*/ {
    /**
     * Create logistic.
     *
     * @param {Data.Global} game The global game object.
     * @param {Data.Global} room The current room.
     * @param {Logistics.Action[]} actionChain List of action to do.
     * @param {Logistics.Room.Population} population Room population logistic.
     * @param {logistics.Handler.Action} actionHandler Handler for actions.
     */
    constructor(game, room, actionChain, population, actionHandler)
    {
        //super(game);
        this._room = room;
        this._actionChain = actionChain;
        this._population = population;
        this._actionHandler = actionHandler;
    }

    /**
     * Execute the logistic part.
     */
    run()
    {
        //this.resetOnTick();

        var actions = _.sortBy(this._actionChain, unit => unit.priority);

        // create required creeps
        for(let unit of actions.entries()) {
            if(this._population.create(unit[1])) break;
        }

        this._actionHandler.assignActions();
    }

    /**
     * Reset cache properties.
     */
    reset()
    {
    }
}
