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

    move(target)
    {
        if (this.$.memory.target != target.id) {
            delete(this.$.memory.target);
            delete(this.$.memory.movePath);
            delete(this.$.memory.lastStep);
            this.$.memory.moveTry = 0;
        }
        this.$.memory.target = target.id;

        if(
            this.$.memory.lastStep
            && this.$.memory.lastStep.x != this.$.pos.x
            && this.$.memory.lastStep.y != this.$.pos.y
        ) {
            if (this.$.memory.movePath.length <= 1) {
                this.$.memory.movePath = []; // one step missing => arrived.
            } else {
                if(this.$.memory.moveTry > 3) {
                    delete(this.$.memory.movePath); // not movable => new path
                } else {
                    this.$.memory.moveTry++;
                    this.$.memory.movePath.unshift(this.$.memory.lastStep);
                }
            }
        }

        if (!this.$.memory.movePath) {
            PathFinder.use(true);
            this.$.memory.movePath = this.$.room.findPath(
                this.$.pos
                , target.pos
                , {
                    ignoreCreeps: true
                    , ignoreRoads: true
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
}

Creep.TYPE_ENERGY = "energy";
Creep.TYPE_MINER = "miner";

module.exports = Creep;
