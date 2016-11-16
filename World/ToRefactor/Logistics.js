var MyCreep = require("./Creep");

function Logistics(plugins) {
    this.Spawns;
    this.Room;
    this.ActionTargets;
    this.Plugins = plugins;
    this.Extensions;
    this.ExtensionEnergy = 0;
    this.AvgCarry = 50;
    this.AvgMinerSpeed = 2;

    this.SETUP = {};
    this.SETUP[MyCreep.TYPE_WORKER] = [
        {e: 0, parts: [WORK, CARRY, CARRY, MOVE]}
        , {e: 0, parts: [WORK, CARRY, CARRY, MOVE]}
        , {e: 5, parts: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]}
        , {e: 10, parts: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]}
    ];
    this.SETUP[MyCreep.TYPE_MINER] = [
        {e: 0, parts: [WORK, WORK, CARRY, MOVE]}
        , {e: 0, parts: [WORK, WORK, CARRY, MOVE]}
        , {e: 5, parts: [WORK, WORK, WORK, WORK, CARRY, MOVE]}
        , {e: 10, parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]}
    ];
}

Logistics.prototype = Object.create(Object);
module.exports = Logistics.prototype.constructor = Logistics;

Logistics.prototype.GetWorkers = function() {
    var self = this;
    var workers = [];
    var carry = 0;
    var minerSpeed = 0;
    var minerCount = 0;
    _.forEach(Game.creeps, function(creep) {
        carry += creep.carryCapacity;
        if (creep.memory.type == MyCreep.TYPE_MINER) {
            minerCount++;
            minerSpeed += _.countBy(creep.body, "type")[WORK] * 2;
        }
        workers.push(new MyCreep(
            self
            , creep.name
            , creep.memory.type ? creep.memory.type : MyCreep.TYPE_WORKER
        ));
    });
   this.AvgCarry = carry / workers.length;
   this.AvgMinerSpeed = minerSpeed / minerCount;

    return workers;
}

Logistics.prototype.Run = function(room) {
    var self = this;
    this.RunTimeData(room);
    var stack = this.SearchRequirements();
    var numWorker = 0, self = this;
    var hasPower = 0;
    _.forEach(stack, function(data) { 
        numWorker += data.need;
    });

    _.forEach(this.ActionTargets.Charge, function(drop, i) {
        if (!drop) return;
        var obj = Game.getObjectById(drop.target);
        if(obj) hasPower += obj.amount;
        else self.ActionTargets.Charge.splice(i,1);
    });

    var workers = this.GetWorkers();
    var maxWorkers = Math.ceil(hasPower / this.AvgCarry);
    if(!maxWorkers) maxWorkers = 1;
    var maxMiner = Math.ceil((this.ActionTargets.Mine.length * 10) / this.AvgMinerSpeed);
    if(maxMiner < this.ActionTargets.Mine.length) maxMiner = this.ActionTargets.Mine.length; 
    if(!maxMiner) maxMiner = 1;
    //console.log("!>", hasPower, maxWorkers, this.AvgCarry, "M", maxMiner, this.AvgMinerSpeed);

    var creepTypes = _.countBy(Game.creeps, "memory.type");
    //console.log("T>", JSON.stringify(creepTypes));

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
        //console.log(_.map(data)); // debug orders
        for (var i = 0; i < data.need - data.has; i++) {
            var creep = _.find(freeWorkers, {Type: data.type});
            if(creep) {
                freeWorkers.splice(freeWorkers.indexOf(creep), 1);
            } else {
                if (creepTypes[MyCreep.TYPE_WORKER] == undefined) {
                    creep = new MyCreep(self, null, MyCreep.TYPE_WORKER, self.SETUP[MyCreep.TYPE_WORKER][1].parts);
                    workers.push(creep);
                    return;
                }
                //console.log("Search for other prio", action);
                var priority = _.filter(workers, function(x) {
                    return stack[x.GetAction()] && stack[x.GetAction()].priority > data.priority && x.Type == data.type;
                });
                //console.log("found", priority.length);

                if (priority.length == 0) {
                    if(stopCreate || (
                            (data.type == MyCreep.TYPE_WORKER && workers.length >= maxWorkers) 
                            || (
                                data.type == MyCreep.TYPE_MINER
                                && (
                                    creepTypes[MyCreep.TYPE_MINER] >= maxMiner 
                                    || creepTypes[MyCreep.TYPE_WORKER] <= creepTypes[MyCreep.TYPE_MINER]
                                )
                            )
                        )
                    ) return; // limit creeps, but force miners
                    // create new one
                    var parts = null;
                    if (!self.Extensions.length) {
                        parts = self.SETUP[data.type][1].parts;
                    } else {
                        for(var i = self.Extensions.length - 1; i >= 0 && parts == null; i--) {
                            var bp = self.SETUP[data.type][i];
                            if(bp && (
                                (bp.e <= self.Extensions.length && _.countBy(Game.creeps, function() { return "count";}).count > 1)
                                || bp.e == 0
                            )) {
                                parts = bp.parts;
                            }
                        }
                    }
                    //console.log("CRE", data.type, JSON.stringify(parts));
                    creep = new MyCreep(self, null, data.type, parts);
                    stopCreate = true;
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

Logistics.prototype.RunTimeData = function(room) {
    this.Room = room;
    this.Spawns = this.Room.find(FIND_MY_SPAWNS);

    this.UpdateExtensions();
    this.UpdateTargets();
}

Logistics.prototype.UpdateExtensions = function() {
    var self = this;
    this.Extensions = this.Room.find(
        FIND_MY_STRUCTURES, {
            filter: function(s) { return s instanceof StructureExtension; }
        }
    );
    this.ExtensionEnergy = 0;
    _.forEach(this.Extensions, function(extension) {
        self.ExtensionEnergy += extension.energy;
    });
}

Logistics.prototype.UpdateTargets = function() {
    var mem;
    this.ActionTargets = mem = this.Mem().ActionTargets;
    if (!mem || this.Mem().Cycle > 2) {
        this.Mem().Cycle = 0;
        mem = {
            Charge: this.UpdateEnergy()
            , Build: this.UpdateBuildingTargets()
            , Mine: this.UpdateMines()
            , StructureEnergy: this.UpdateLoadableStructures()
        };
        this.ActionTargets = this.Mem().ActionTargets = mem;
    }
    this.Mem().Cycle++;
}

Logistics.prototype.UpdateEnergy = function() {
    var drops = [];

    _.forEach(this.Room.find(
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

    _.forEach(this.Room.find(FIND_SOURCES), function(source) {
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
                var terrain = self.Room.lookForAt(LOOK_TERRAIN, rx + x, ry + y);
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
    return this.SearchTargets(this.Room.find(FIND_CONSTRUCTION_SITES));
}

Logistics.prototype.UpdateLoadableStructures = function() {
    return this.SearchTargets(
        this.Room.find(
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
    var self = this;
    var stack = {
        Charge: {
            action: "Charge"
            , need: 0
            , has: 0
            , priority: 2
            , type: MyCreep.TYPE_WORKER
        } // default action if creep empty
    };

    var spawnEnergy = {
        action: "Fill.Spawn"
        , need: 0
        , has: 0
        , priority: 5
        , type: MyCreep.TYPE_WORKER
    }
    _.forEach(this.Spawns, function(spawn){
        if (spawn.energy < spawn.energyCapacity) {
            spawnEnergy.need += Math.ceil((spawn.energyCapacity-spawn.energy) / 50)
        }
    });
    if(spawnEnergy.need > 0) {
        stack["Fill.Spawn"] = spawnEnergy;
    }

    if (this.Room.controller.level < 8) 
        stack["Fill.Controller"] = {
            action: "Fill.Controller"
            , need: this.Room.controller.level * 3
            , has: 0
            , priority: 10 * (this.Room.controller.level - 1) + 1 // reduce prio on high level
            , type: MyCreep.TYPE_WORKER
        };

    if (this.ActionTargets.Build.length > 0) {
        stack["Build"] = {
            action: "Build"
            , need: this.ActionTargets.Build.length * this.Room.controller.level * 2
            , has: 0
            , priority: 10
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

    if (this.ActionTargets.StructureEnergy.length > 0) {
        stack["Fill.Structure"] = {
            action: "Fill.Structure"
            , need: this.ActionTargets.StructureEnergy.length * 2
            , has: 0
            , priority: 8
            , type: MyCreep.TYPE_WORKER
        };
    }

    return stack;
}

Logistics.prototype.Mem = function() {
    var mem = Memory.Logistics;
    if (!mem) {
        mem = {};
        Memory.Logistics = mem;
    }
    return mem;
}