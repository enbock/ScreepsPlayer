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
        this.parameters = {};
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

        cfg.arguments = this.map(cfg.arguments);

        // Find class object.
        var classObject = require("./" + cfg.class);

        // create instance and inject it
        var service = Reflect.construct(classObject, cfg.arguments);

        // buffer the service
        this.services[name] = service;

        return service;
    };

    map(argument)
    {
        if (
            (typeof argument === "string" || argument instanceof String)
        ) {
            if(argument.indexOf("@") === 0) {
                return this.get(argument.replace("@", ""));
            }
            if(argument.indexOf("$") === 0) {
                return (new Function(
                    "return Memory." + argument.replace("$", "") + ";"
                )).call(this);
            }
            if(argument.indexOf("#") === 0) {
                return (new Function(
                    "return " + argument.replace("#", "") + ";"
                )).call(this);
            }
            if(argument.indexOf("%") === 0) {
                return this.getParameter(argument.replace("%", ""));
            }
        } else if (argument instanceof Array) {
            for(var i = 0; i < argument.length; i++) {
                argument[i] = this.map(argument[i]);
            }
            return argument;
        }

        return argument;
    }

    /**
     * Set an external instance to container.
     *
     * @param {String} name     Name of service.
     * @param {Object} instance External instance.
     */
    set(name, instance) {
        this.services[name] = instance;
    };

    /**
     * Get a parameter
     *
     * @param {String} name The parameter name.
     *
     * @return {*} The parameter content.
     */
    getParameter(name) {
        var i;
        
        if (this.parameters[name]) {
            return this.parameters[name];
        }
        var cfg = this.config.parameters[name];

        cfg = this.map(cfg);

        // buffer the service
        this.parameters[name] = cfg;

        return cfg;
    };
}