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

function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};


function Creep(logistic, name, type, parameters)
{
    this.Parameters = parameters;
    this.Name = name ? name : this.FindName();
    this.Logistic = logistic;
    this.Me = Game.creeps[this.Name];
    this.Type = type;
    if (!this.Me) this.Create();
}

Creep.TYPE_WORKER = "worker";
Creep.TYPE_MINER = "miner";

Creep.prototype = Object.create(Object);
module.exports = Creep.prototype.constructor = Creep;

Creep.prototype.IsEmpty = function() {
    return _.sum(this.Me.carry) == 0;
}

Creep.prototype.IsFull = function() {
    return _.sum(this.Me.carry) == this.Me.carryCapacity;
}

Creep.prototype.IsIdle = function() {
    return this.Mem().action == "None";
}

Creep.prototype.Create = function() {
    if (Game.creeps[this.Name]) {
        this.Me = Game.creeps[this.Name];
    } else {
        //console.log("Try to spawn", this.Name, this.Parameters);
        this.Logistic.Spawn.createCreep(
            this.Parameters
            , this.Name
            , {type: this.Type, action: "None"}
        );
        this.Me = Game.creeps[this.Name];
    }
}

Creep.prototype.Mem = function() {
    return this.Me.memory;
}

Creep.prototype.Run = function() {
    if (!this.Me) return;

    var action = this.GetAction();
    if(action === undefined) {
        //console.log("No action for", this.Name);
        return;
    }
    //console.log("Run", action, this.Name);
    require("./Creep.Action." + action)(this);
}

Creep.prototype.Move = function(target) {
    var result;
    //*/
    if (this.Mem()._move && this.Mem()._move.path) {
        result = this.Me.moveByPath(this.Mem()._move.path);
        this.Mem().moveOpt++;
        if (this.Mem().moveOpt > Math.random()*5) {
            result = ERR_NOT_FOUND;
            this.Mem().moveOpt = 0;
        }
        if (result != OK && result != ERR_TIRED) result = this.Me.moveTo(target);
    } else result = this.Me.moveTo(target);
    /*/
    result = this.Me.moveTo(target);
    //*/

    if(result == OK) {
        this.Mem().moveTry = 0;
        this.Mem().target = target.id; // set only if success
    } else if(result == ERR_NO_PATH) {
        this.Mem().moveTry = this.Mem().moveTry + 1;
        if (this.Mem().moveTry > 4) {
            this.Mem().moveTry = 0;
            delete(this.Mem().target);
            this.Me.say("O-=");
        }
    } else if(result == ERR_INVALID_TARGET) {
        this.Me.say("@!#?");
        delete(this.Mem().target);
    }
    return result;
}

Creep.prototype.SetAction = function(action) {
    this.Mem().action = action;
    delete(this.Mem().target);
}

Creep.prototype.GetAction = function() {
    return this.Mem().action;
}

Creep.prototype.FindName = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) return name;
    }

    return NAMES[Math.floor((NAMES.length - 1) * Math.random())] + " " + uuid();
}