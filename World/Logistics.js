var MyCreep = require("./Creep");

function Logistics() {
    this.Spawn;
    this.ActionTargets;
}
Logistics.prototype = Object.create(Object);
module.exports = Logistics.prototype.constructor = Logistics;

Logistics.prototype.Run = function(spawn) {
    this.RunTimeData(spawn);
    var stack = this.SearchRequirements();
    var numWorker = 0;
    _.forEach(stack, function(data) { numWorker += data.need; });
    var workers = this.CheckNumWorker(numWorker);

    var working = [];
    workers.forEach(function(creep) {
        // check for empty
        if (creep.IsEmpty() && creep.GetAction() != "Charge") {
            creep.Me.say("Charge");
            creep.SetAction("Charge");
         }

        var action = creep.GetAction();
        if (action != "Charge" &&
            (
                creep.IsIdle() || 
                !stack[action] || 
                (
                    stack[action] &&
                    stack[action].need <= stack[action].has
                )
            )
        ) {
            creep.SetAction("None"); // not more needed
            return;
        }
        stack[action].has++;
        working.push(creep);
    });

    var freeWorkers = _.filter(workers, function(x) {
            return working.indexOf(x) == -1;
    });

    //console.log("free>", freeWorkers.length);

    _.forEach(_.sortByOrder(stack, ['priority'], ['asc']), function(data) {
        var action = data.action;
        console.log(_.map(data));
        for (var i = 0; i < data.need - data.has; i++) {
            var creep;
            if(freeWorkers.length > 0) {
                creep = freeWorkers.shift();
            } else {
                //console.log("Search for other prio", action);
                var priority = _.filter(workers, function(x) {
                    //console.log("=", x.GetAction(), stack[x.GetAction()].priority);
                    return stack[x.GetAction()].priority > data.priority;
                });
                //console.log("found", priority.length);
                if (priority.length == 0) return; // skip action
                creep = priority.pop();
            }
            creep.Me.say(action);
            creep.SetAction(action);
        }
    });

    // run workers
    workers.forEach(function(creep) { creep.Run(); });

    console.log("targets:", JSON.stringify(this.ActionTargets));
}

Logistics.prototype.RunTimeData = function(spawn) {
    this.Spawn = spawn;

    this.UpdateTargets();
}

Logistics.prototype.UpdateTargets = function() {
    this.ActionTargets = {
        Charge: this.UpdateSources()
        , Build: this.UpdateBuildingTargets()
    };
}

Logistics.prototype.UpdateSources = function() {
    var sources = [];

    _.forEach(this.Spawn.room.find(FIND_SOURCES), function(source) {
        var item = {
            target: source.id
            , creeps: 0
        };
        _.forEach(Game.creeps, function(creep) {
            if (creep.memory.target == item.target) item.creeps++;
        });
        sources.push(item);
    });
    
    return sources;
}

Logistics.prototype.UpdateBuildingTargets = function() {
    var data = [];
    var targets = this.Spawn.room.find(FIND_CONSTRUCTION_SITES);
    targets.forEach(function(target) {
        var item = {
            target: target.id
            , creeps: 0
        };
        _.forEach(Game.creeps, function(creep) {
            if (item.target == creep.memory.target) item.creeps++;
        })
        data.push(item);
    });

    return data;
}

Logistics.prototype.CheckNumWorker = function(neededWorker) {
    var self = this;
    var workers = [];
    _.forEach(Game.creeps, function(creep) {
        workers.push(new MyCreep(self, creep.name));
    });
    var diff = neededWorker - workers.length 
    for(var i = 0; i < diff; i++) {
        //console.log("Create new worker");
        var newCreep = new MyCreep(self, null, [WORK, CARRY, MOVE, MOVE]);
        if (!Game.creeps[newCreep.Name]) break; // can't create more
        workers.push(newCreep);
    }

    return workers;
}

Logistics.prototype.SearchRequirements = function() {
    var stack = {
        Charge: {
            action: "Carge"
            , need: 0
            , has: 0
            , priority: 0
        } // default action if creep empty
    };
    if (this.Spawn.energy < this.Spawn.energyCapacity) {
        stack["Fill.Spawn"] = {
            action: "Fill.Spawn"
            , need: Math.ceil((this.Spawn.energyCapacity-this.Spawn.energy) / 50)
            , has: 0
            , priority: 1
        }
    }

    if (this.Spawn.room.controller.level < 8) 
        stack["Fill.Controller"] = {
            action: "Fill.Controller"
            , need: Math.ceil(8 - this.Spawn.room.controller.level) * 2
            , has: 0
            , priority: 10 * (this.Spawn.room.controller.level - 1) // reduce prio on high level
        };

    if (this.ActionTargets.Build.length > 0) {
        stack["Build"] = {
            action: "Build"
            , need: this.ActionTargets.Build.length * 2
            , has: 0
            , priority: 8
        };
    }

    return stack;
}
