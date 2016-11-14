function Builder() {
    Object.call(this);

    this.BuildAfter = 100;
    this.RemoveAfter = 900; // Remove a point x ticks later
}
Builder.prototype = Object.create(Object);
module.exports = Builder.prototype.construction = Builder;

Builder.prototype.Run = function(logistic) {
    var self = this;
    var memory = this.Mem(), date = (new Date).valueOf();
    var lastTick = memory.lastTick;
    memory.lastTick = date;
    var tickDiff = (date - lastTick) / 1000.0;
    _.forEach(Game.creeps, function(creep) {
        var pos = creep.pos.roomName + ":" + creep.pos.x + "," + creep.pos.y;
        if(creep.room.lookForAt(LOOK_STRUCTURES, creep).length > 0) {
            delete(memory[pos]);
            return;
        }
        if (!memory[pos] || !memory[pos].count) memory[pos] = { count:0, date: date };
        memory[pos].count++;
        memory[pos].count = Math.round(memory[pos].count - (
            ((date - memory[pos].date) / (1000 * tickDiff)) / self.RemoveAfter 
            //* (0.5 - 0.5 / self.BuildAfter * memory[pos].count)
        ));
        if (memory[pos].count < 0) memory[pos].count = 1;
        memory[pos].date = date;

        //creep.say(memory[pos].count);
        //console.log(pos, memory[pos].count, (tickDiff*100.0)+"%");

        if(memory[pos].count > self.BuildAfter) {
            delete(memory[pos]);
            creep.say("( )");
            creep.room.createConstructionSite(
                creep.pos, STRUCTURE_ROAD
            );
        }
    });
};

Builder.prototype.Mem = function() {
    var memory = Memory.StreetBuilder;
    if (!memory) {
        memory = {};
        Memory.StreetBuilder = memory;
    }
    return memory;
};