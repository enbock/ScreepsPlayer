/**
 * Creep controller.
 * 
 * Contains additional functionality to create and control a creep.
 */
module.exports = class Creep {
    /**
     * Create object.
     * 
     * @param {Creep} Native creep object.
     */
    constructor(creep)
    {
        Object.call(this);

        // game creep object.
        this.$ = creep;
    }
}