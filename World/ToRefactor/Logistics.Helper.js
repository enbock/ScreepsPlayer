function Helper() {
    Object.call(this);
}
Helper.prototype = Object.create(Object);
Helper.prototype.constructor = Helper;

Helper.prototype.FindActionTarget = function(targets, condition) {
    var smallest = 1000000;
    var source;
    targets.forEach(function(target) {
        if(smallest > target.creeps)
            smallest = target.creeps;
    });
    for(var i = 0; i < targets.length && !source; i++) {
        if(targets[i].creeps <= smallest) {
            source = targets[i].target;
            if (condition(source)) targets[i].creeps++;
            else source = null;
        }
    }

    return source;
};

// Singleton
module.exports = new Helper();