// Creep names :)
const NAMES = [
    "Shawanna",
    "Maida",
    "Melvina",
    "Larae",
    "Janene",
    "Lilli",
    "Bailey",
    "Tova",
    "Steven",
    "Jolene",
    "Kum",
    "Magan",
    "Kimber",
    "Alex",
    "Miles",
    "Burton",
    "Kristopher",
    "Jacquiline",
    "Bo",
    "Marlena",
    "Hal",
    "Alica",
    "Carylon",
    "Dominque",
    "Emerita",
    "Penelope",
    "Un",
    "Tona",
    "Blair",
    "Hugh",
    "Nieves",
    "Sammy",
    "Madison",
    "Trula",
    "Regenia",
    "Luise",
    "Marcelino",
    "Lavina",
    "Elda",
    "Lannie",
    "Tessa",
    "Magaret",
    "Dominiquev",
    "Usha",
    "Caryl",
    "Bobbie",
    "Theda",
    "Kathaleen",
    "Lory",
    "Dawna"
]

/**
 * Make a uuid.
 */
function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

var MyCreep = require("./Creep");

/**
 * A creep builder.
 */
module.exports = class Creator {
    /**
     * Create the builder.
     * 
     * @param {Data.Global} memory Global memory access.
     * @param {Data.Global} game Global game access.
     */
    constructor(memory, game)
    {
        Object.call(this);

        this._memory = memory;
        this._game = game;
    }

    /**
     * Create creep data obejct from game creep.
     * 
     * @param {Creep} creep The game creep object.
     */
    factory(creep)
    {
        return new MyCreep(this._game.get(), creep);
    }

    /**
     * Spawn a creep.
     * 
     * @param {Spawn} spawn Native spawn object.
     * @param {String[]} setup List of body parts.
     * @param {String} type Type of creep.
     * 
     * @returns {int} Status code.
     */
    spawn(spawn, setup, type)
    {
        var name = this.findName();

        // checking for costs
        var checkResult = spawn.canCreateCreep(
            setup, name
        );
        if (checkResult != OK) return checkResult;

        var creepName = spawn.createCreep(
            setup
            , name
            , {
                type: type
                , homeRoom: spawn.room.name
                , action: "None"
            }
        )

        if(!_.isString(creepName)) {
            return creepName;
        }

        return OK;
    }

    /**
     * Create a name.
     * 
     * Reuse a name from dead creeps to save memory size.
     * 
     * @returns {String|NULL}
     */
    findName() {
        for(var name in this._memory.get().creeps) {
            if(! this._game.get().creeps[name]) return name;
        }
        //*/
        return null; // use build in generator
        /*/
        return NAMES[Math.floor((NAMES.length - 1) * Math.random())] + " " + uuid();
        //*/
    }
}