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


function Creep(logistic, name, parameters)
{
    this.Parameters = parameters;
    this.Name = name ? name : this.FindName();
    this.Logistic = logistic;
    this.Me = Game.creeps[this.Name];
    if (!this.Me) this.Create();
}

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
            this.Parameters, this.Name
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
    if((result = this.Me.moveTo(target)) == 0) {
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