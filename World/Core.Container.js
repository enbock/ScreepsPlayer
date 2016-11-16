/**
 * Injection container for screeps.
 *
 * @constructor
 *
 * @param {Object} config Service config.
 */
function Container(config) {
    Object.call(this);

    this.config   = config;
    this.services = {};
}
Container.prototype = Object.create(Object.prototype);
module.exports = Container.prototype.constructor = Container;

/**
 * Create and get a service.
 *
 * @param {String} name The service name.
 *
 * @return {Object} The service object.
 */
Container.prototype.get = function(name) {
    var i;
    
    if (this.services[name]) {
        return this.services[name];
    }
    var cfg = this.config.services[name];

    if(! cfg.hasOwnProperty("arguments")) {
        cfg.arguments = [];
    }

    for(i in cfg.arguments) {
        var argument = cfg.arguments[i];
        if (
            (typeof argument === "string" || argument instanceof String)
        ) {
            if(argument.indexOf("@") === 0) {
                cfg.arguments[i] = this.get(argument.replace("@", ""));
            }
            if(argument.indexOf("$") === 0) {
                cfg.arguments[i] = (new Function(
                    "return Memory." + argument.replace("$", "") + ";"
                )).call(use.context);
            }
        }
    }

    // Find class object.
    var classObject = require("./" + cfg.class);

    // create instance and inject it
    var service = Object.create(classObject.prototype);
    classObject.apply(service, cfg.arguments);

    // buffer the service
    this.services[name] = service;

    return service;
};

/**
 * Set an external instance to container.
 *
 * @param {String} name     Name of service.
 * @param {Object} instance External instance.
 */
Container.prototype.set = function(name, instance) {
    this.services[name] = instance;
};