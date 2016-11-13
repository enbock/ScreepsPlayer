var My = require("./index");

var logistics = {};

module.exports.loop = function () {
    _.forEach(Game.spawns, function(spawn) {
        if (! logistics[spawn.name]) {
            //console.log("Create logistic for " + spawn.name);
            logistics[spawn.name] = new My.Logistics();
        }
        logistics[spawn.name].Run(spawn);
    });
}