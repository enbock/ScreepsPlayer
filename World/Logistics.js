var MyCreep = require("./Creep");

function Logistics(plugins) {
    this.Spawn;
    this.ActionTargets;
    this.Plugins = plugins;

    this.SETUP = {};
    this.SETUP[MyCreep.TYPE_WORKER] = [
        [WORK, CARRY, CARRY, MOVE]
    ];
    this.SETUP[MyCreep.TYPE_MINER] = [
        [WORK, WORK, CARRY, MOVE]
    ];
    this.Extensions = 0;
}

Logistics.prototype = Object.create(Object);
module.exports = Logistics.prototype.constructor = Logistics;

Logistics.prototype.GetWorker = function() {
    var self = this;
    var workers = [];
    _.forEach(Game.creeps, function(creep) {
        workers.push(new MyCreep(
            self
            , creep.name
            , creep.memory.type ? creep.memory.type : MyCreep.TYPE_WORKER
        ));
    });
    /*
    var diff = neededWorker - workers.length 
    for(var i = 0; i < diff && workers.length < limit; i++) {
        //console.log("Create new worker");
        var newCreep = new MyCreep(self, null, [WORK, CARRY, MOVE, MOVE]);
        if (!Game.creeps[newCreep.Name]) break; // can't create more
        workers.push(newCreep);
    }
    */

    return workers;
}

Logistics.prototype.Run = function(spawn) {
    this.RunTimeData(spawn);
    var stack = this.SearchRequirements();
    var numWorker = 0, self = this;
    var hasPower = 0;
    _.forEach(stack, function(data) { 
        numWorker += data.need;
    });

    this.ActionTargets.Charge.forEach(function(drop) {
        hasPower += Game.getObjectById(drop.target).amount;
    });
    var maxWorkers = Math.ceil(hasPower / 100.0); // TODO Use extension level.
    //console.log("!>", hasPower, maxWorkers);

    var workers = this.GetWorker(numWorker);

    var working = [];
    workers.forEach(function(creep) {
        var action = creep.GetAction();
        if(!creep.IsIdle() && stack[action]) {
            stack[action].has++;
            working.push(creep);
        }
    });

    var freeWorkers = _.filter(workers, function(x) {
        return working.indexOf(x) == -1;
    });

    //console.log("free>", freeWorkers.length);

    var stopCreate = false;
    _.forEach(_.sortByOrder(stack, ['priority'], ['asc']), function(data) {
        var action = data.action;
        console.log(_.map(data)); // debug orders
        for (var i = 0; i < data.need - data.has; i++) {
            var creep = _.find(freeWorkers, {Type: data.type});
            if(creep) {
                freeWorkers.splice(freeWorkers.indexOf(creep), 1);
            } else {
                //console.log("Search for other prio", action);
                var priority = _.filter(workers, function(x) {
                    return stack[x.GetAction()] && stack[x.GetAction()].priority > data.priority && x.Type == data.type;
                });
                //console.log("found", priority.length);

                if (priority.length == 0) {
                    if(stopCreate || (maxWorkers < workers.length && data.type != MyCreep.TYPE_MINER)) return; // limit creeps, but force miners
                    // create new one
                    creep = new MyCreep(self, null, data.type, self.SETUP[data.type][self.Extensions]);
                    stopCreate = maxWorkers <= 1;
                    return; // can't create more
                }
                creep = priority.pop();
            }
            creep.Me.say(action);
            creep.SetAction(action);
            workers.push(creep);
        }
    });

    // run workers
    workers.forEach(function(creep) { creep.Run(); });

    if (this.Plugins instanceof Array) {
        this.Plugins.forEach(function(plugin) {
            plugin.Run(self);
        })
    }

    //console.log("targets:", JSON.stringify(this.ActionTargets));
}

Logistics.prototype.RunTimeData = function(spawn) {
    this.Spawn = spawn;

    this.UpdateTargets();
}

Logistics.prototype.UpdateTargets = function() {
    this.ActionTargets = {
        Charge: this.UpdateEnergy()
        , Build: this.UpdateBuildingTargets()
        , Mine: this.UpdateMines()
        , LoadStructures: this.UpdateLoadableStructures()
    };
    //console.log(JSON.stringify(this.ActionTargets.LoadStructures));
}

Logistics.prototype.UpdateEnergy = function() {
    var drops = [];

    _.forEach(this.Spawn.room.find(
        FIND_DROPPED_RESOURCES
        , {filter: {resourceType: RESOURCE_ENERGY}}
    ), function(resource) {
        var item = {
            target: resource.id
            , creeps: 0
        };
        _.forEach(Game.creeps, function(creep) {
            if (creep.memory.target == item.target) item.creeps++;
        });
        drops.push(item);
    });
    
    return drops;
}

Logistics.prototype.UpdateMines = function() {
    var sources = [], self = this;

    _.forEach(this.Spawn.room.find(FIND_SOURCES), function(source) {
        var item = {
            target: source.id
            , creeps: 0
            , max: 0
        };
        var rx = source.pos.x;
        var ry = source.pos.y;
        for(var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) continue;
                var terrain = self.Spawn.room.lookForAt(LOOK_TERRAIN, rx + x, ry + y);
                if(terrain == "plain") {
                    item.max++;
                }
            }
        }
        _.forEach(Game.creeps, function(creep) {
            if (creep.memory.target == item.target) item.creeps++;
        });
        sources.push(item);
    });

    return sources;
}

Logistics.prototype.SearchTargets = function(targets) {
    var data = [];
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

Logistics.prototype.UpdateBuildingTargets = function() {
    return this.SearchTargets(this.Spawn.room.find(FIND_CONSTRUCTION_SITES));
}

Logistics.prototype.UpdateLoadableStructures = function() {
    return this.SearchTargets(
        this.Spawn.room.find(
            FIND_STRUCTURES
            , {filter: function(x) { 
                return x.energy != undefined  
                    && !(
                        x instanceof StructureController
                        || x instanceof StructureSpawn
                    ) && x.energy < x.energyCapacity; 
            }}
        )
    );
}

Logistics.prototype.SearchRequirements = function() {
    var stack = {
        Charge: {
            action: "Charge"
            , need: 0
            , has: 0
            , priority: 2
            , type: MyCreep.TYPE_WORKER
        } // default action if creep empty
    };
    if (this.Spawn.energy < this.Spawn.energyCapacity) {
        stack["Fill.Spawn"] = {
            action: "Fill.Spawn"
            , need: Math.ceil((this.Spawn.energyCapacity-this.Spawn.energy) / 50)
            , has: 0
            , priority: 5
            , type: MyCreep.TYPE_WORKER
        }
    }

    if (this.Spawn.room.controller.level < 8) 
        stack["Fill.Controller"] = {
            action: "Fill.Controller"
            , need: Math.ceil(this.Spawn.room.controller.level) * 3
            , has: 0
            , priority: 10 * (this.Spawn.room.controller.level - 1) + 1 // reduce prio on high level
            , type: MyCreep.TYPE_WORKER
        };

    if (this.ActionTargets.Build.length > 0) {
        stack["Build"] = {
            action: "Build"
            , need: this.ActionTargets.Build.length * 2
            , has: 0
            , priority: 8
            , type: MyCreep.TYPE_WORKER
        };
    }

    if (this.ActionTargets.Mine.length > 0) {
        var need = 0;
        this.ActionTargets.Mine.forEach(function(item){
            need += item.max;
        });
        stack["Mine"] = {
            action: "Mine"
            , need: need
            , has: 0
            , priority: 0
            , type: MyCreep.TYPE_MINER
        };
    }

    if (this.ActionTargets.LoadStructures.length > 0) {
        stack["LoadStructure"] = {
            action: "LoadStructure"
            , need: this.ActionTargets.LoadStructures.length * 3
            , has: 0
            , priority: 20
            , type: MyCreep.TYPE_WORKER
        };
    }

    return stack;
}
