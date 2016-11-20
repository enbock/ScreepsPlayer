/**
 * Creep controller.
 *
 * Contains additional functionality to create and control a creep.
 */
class Creep {
    /**
     * Create object.
     *
     * @param {Game} game Native game object.
     * @param {Creep} creep Native creep object.
     */
    constructor(game, creep)
    {
        // game creep object.
        this.$ = creep;
        this._game = game;
    }

    /**
     * String value of the creep.
     */
    toString()
    {
        return "[Creep " + this.$.memory.type + " " + this.$.name + "]";
    }

    /**
     * Set new creep action.
     *
     * @param {String} action
     */
    set action(action)
    {
        if(action != "Action.None")
            this.$.say(action.replace("Action.", ""));
        this.$.memory.action = action;
    }

    /**
     * Get action of creep.
     *
     * @returns {String}
     */
    get action()
    {
        if(!this.$.memory.action) return "Action.None";
        return this.$.memory.action;
    }

    /**
     * Move the creep to target.
     * 
     * @param {Object} Target to move on.  
     */
    move(target)
    {
        var ignoreCreeps = true;

        if (this.$.memory.moveTarget != target.id || (this.$.memory.movePath && this.$.memory.movePath.length == 0)) {
            ignoreCreeps = !(this.$.memory.movePath && this.$.memory.movePath.length == 0);
            delete(this.$.memory.moveTarget);
            delete(this.$.memory.movePath);
            delete(this.$.memory.lastStep);
            this.$.memory.moveTry = 0;
        }
        this.$.memory.moveTarget = target.id;

        if(
            this.$.memory.lastStep
            && this.$.memory.lastStep.x != this.$.pos.x
            && this.$.memory.lastStep.y != this.$.pos.y
        ) {
            if (this.$.memory.movePath.length <= 1) {
                var divX = this.$.memory.lastStep.x - this.$.pos.x;
                var divY = this.$.memory.lastStep.y - this.$.pos.y;
                divX = divX < 0 ? divX * - 1 : divX;
                divY = divY < 0 ? divY * - 1 : divY;
                if(divX > 1 || divY > 1) {
                    ignoreCreeps = false;
                    delete(this.$.memory.movePath); // not movable => new path
                } else {
                    this.$.memory.movePath = []; // one step missing => arrived.
                }
            } else {
                if(this.$.memory.moveTry > 3) {
                    ignoreCreeps = false;
                    delete(this.$.memory.movePath); // not movable => new path
                } else {
                    this.$.memory.moveTry++;
                    this.$.memory.movePath.unshift(this.$.memory.lastStep);
                    delete(this.$.memory.lastStep);
                }
            }
        }

        if (!this.$.memory.movePath) {
            //this.$.say("?..--´´");
            PathFinder.use(true);
            this.$.memory.movePath = this.$.room.findPath(
                this.$.pos
                , target.pos
                , {
                    ignoreCreeps: ignoreCreeps
                    ,ignoreRoads: true
                }
            );
        }

        if (this.$.memory.movePath.length == 0) {
            // arrived
            return;
        }

        if(this.$.fatigue > 0) return; // can't move
        
        var step = this.$.memory.lastStep = this.$.memory.movePath.shift();
        this.$.move(step.direction);
    }

    /**
     * Check if carry is full.
     * 
     * @returns {boolean} true wenn carry is full. 
     */
    get isFull()
    {
        return _.sum(this.$.carry) == this.$.carryCapacity;
    }

    /**
     * Check if carry is empty.
     * 
     * @returns {boolean} true wenn carry is empty. 
     */
    get isEmpty()
    {
        return _.sum(this.$.carry) == 0;
    }
}

Creep.TYPE_ENERGY = "energy";
Creep.TYPE_MINER = "miner";

module.exports = Creep;
