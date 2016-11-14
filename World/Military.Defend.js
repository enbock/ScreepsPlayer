
function Plugin() {
    Object.call(this);
}
Plugin.prototype = Object.create(Object);
module.exports = Plugin.prototype.construction = Plugin;

Plugin.prototype.Run = function(military)
{
    this.Room = military.Room;

    var enemies = military.Room.find(FIND_HOSTILE_CREEPS);
    console.log("Found", enemies.length, "enemies.");

    if(enemies.length > 0) {
        this.Towers(enemies);
    }
}

Plugin.prototype.Towers = function(enemies)
{
    var towers = this.Room.find(FIND_MY_STRUCTURES, {filter: function(x) { return x instanceof StructureTower; }});
    console.log("Found", towers.length, "towers.");
    towers.forEach(function(tower) {
        if(towers.length == 0) return;
        var target = enemies.shift();   
        var result = tower.attack(target);
        switch(result) {
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Tower need energy.");
                break;
        }
    });

}
