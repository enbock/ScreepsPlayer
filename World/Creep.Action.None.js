/**
 * An action to do .... nothing :)
 */
module.exports = class None {
    /**
     * Run the action.
     *
     * @param {Creep} creep The creep.
     */
    run(creep)
    {
        if(Math.random() <= 0.4 && Math.random() >= 0.6) creep.$.say("zzZ");
        creep.$.move(Math.round(Math.random()*7)+1);
    }

    /**
     * Get action name.
     * 
     * @returns {String}
     */
    toString()
    {
        return "Action.None";
    }
}
