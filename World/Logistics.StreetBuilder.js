function StreetBuilder(logistic) {
    Object.call(this);

    this.BuildAfter = 100;
    this.RemoveAfter = 30;
}
StreetBuilder.prototype = Object.create(Object);
module.exports = StreetBuilder.prototype.construction = StreetBuilder;

StreetBuilder.prototype.Run = function(logistic) {
    var self = this;
    var memory = this.Mem(), date = (new Date).valueOf();
    _.forEach(Game.creeps, function(creep) {
        if(creep.room.lookForAt(LOOK_STRUCTURES, creep).length > 0) return;
        var pos = creep.pos.roomName + ":" + creep.pos.x + "," + creep.pos.y;
        if (!memory[pos] || !memory[pos].count) memory[pos] = { count:0, date: date };
        memory[pos].count++;
        memory[pos].count -= Math.floor((date - memory[pos].date) / 1000 / self.RemoveAfter);
        if (memory[pos].count < 0) memory[pos].count = 1;
        memory[pos].date = date;

        console.log(pos, memory[pos].count);

        if(memory[pos].count > self.BuildAfter) {
            delete(memory[pos]);
            creep.room.createConstructionSite(
                creep.pos, STRUCTURE_ROAD
            );
        }
    });
};

StreetBuilder.prototype.Mem = function() {
    var memory = Memory.StreetBuilder;
    if (!memory) {
        memory = {};
        Memory.StreetBuilder = memory;
    }
    return memory;
};