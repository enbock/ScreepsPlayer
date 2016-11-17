module.exports = {
    services: {
        /**
         * Application
         */
        screeps: {
            class: "Screeps",
            arguments: [
                "@module_logistics"
            ]
        },

        /**
         * Modules
         */
        module_logistics: {
            class: "Logistics",
            arguments: [
                "@data_game",
                "@data_room",
                [
                    "@module_logistics_action_minimum"
                ],
                "@module_logistics_population"
            ]
        },
        module_logistics_room_creeps: {
            class: "Logistics.Room.Creeps",
            arguments: [
                "@data_game",
                "@data_room",
                "@creep_creator"
            ]
        },
        module_logistics_spawns: {
            class: "Logistics.Spawns",
            arguments: [
                "@data_game",
                "@data_room"
            ]
        },
        module_logistics_population: {
            class: "Logistics.Room.Population",
            arguments: [
                {
                    miner: {
                        1: [MOVE, CARRY, WORK, WORK]
                    },
                    worker: {
                        1: [MOVE, CARRY, CARRY, WORK]
                    }
                },
                "@creep_creator",
                "@module_logistics_spawns"
            ]
        },

        module_logistics_action_minimum: {
            class: "Logistics.Action.Minimum",
            arguments: [
                "@data_game",
                "@module_logistics_room_creeps"
            ]
        },

        /**
         * Creep
         */
        creep_creator: {
            class: "Creep.Creator",
            arguments: [
                "@data_memory",
                "@data_game"
            ]
        },

        /**
         * Modules (Data).
         */
        data_game: {
            class: "Data.Global"
        },
        data_memory: {
            class: "Data.Global"
        },
        data_room: {
            class: "Data.Global"
        },
        data_rooms: {
            class: "Data.Rooms",
            arguments: [
                "@data_game"
            ]
        }
    }
} 