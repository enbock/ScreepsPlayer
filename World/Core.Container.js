/**
 * Injection container for screeps.
 */
module.exports = class Container {
    /**
     * Store config.
     *
     * @param {Object} config Service config.
     */
    constructor (config)
    {
        this.config   = config;
        this.services = {};
    }

    /**
     * Create and get a service.
     *
     * @param {String} name The service name.
     *
     * @return {Object} The service object.
     */
    get(name) {
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
                    )).call(this);
                }
                if(argument.indexOf("#") === 0) {
                    cfg.arguments[i] = (new Function(
                        "return " + argument.replace("#", "") + ";"
                    )).call(this);
                }
            }
        }

        // Find class object.
        var classObject = require("./" + cfg.class);

        // create instance and inject it
        var service = Reflect.construct(classObject, cfg.arguments);

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
    set(name, instance) {
        this.services[name] = instance;
    };
}