/**
 * An action to do .... nothing :)
 */
module.exports = class None {
    /**
     * Create the action runner.
     * @param roomCreeps
     */
    constructor(roomCreeps)
    {
        this._roomCreeps = roomCreeps;
    }

    /**
     * Do the action.
     */
    run()
    {
        var creeps = _.filter(this._roomCreeps.creeps, creep => creep.action == "Action.None");

        _.forEach(creeps, creep => {
            this.action(creep);
        });
    }


    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    action(creep)
    {
        if(Math.random() <= 0.4 && Math.random() >= 0.6) creep.$.say("zzZ");
    }
}
