
function Military(plugins) {
    Object.call(this);

    this.Plugins = plugins;
}

Military.prototype = Object.create(Object);
module.exports = Military.prototype.constructor = Military;

Military.prototype.Run = function(room) {
    var self = this;
    this.Room = room;

    this.Plugins.forEach(function(plugin) {
        plugin.Run(self);
    })
}