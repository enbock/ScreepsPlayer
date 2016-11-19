module.exports = {
    parameters: {
        action_chain:  [
            "@module_logistics_action_minimum"
            , "@module_logistics_action_mine"
        ],
        action_to_worker: {
            ["Action.Mine"]: "miner"
            , ["Action.Energy"]: "worker"
        }
    },
    services: {
        /**
         * Application
         */
        screeps: {
            class: "Screeps",
            arguments: [
                "@module_logistics",//*,
                "@creep_executor"//*/
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
                "%action_chain",
                "@module_logistics_population",
                "@module_logistics_handler_action"
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
                    energy: {
                        1: [MOVE, CARRY, CARRY, WORK]
                    }
                },
                "@creep_creator",
                "@module_logistics_spawns"
            ]
        },
        module_logistics_handler_action: {
            class: "Logistics.Handler.Action",
            arguments: [
                "%action_chain",
                "@module_logistics_room_creeps",
                "%action_to_worker"
            ]
        },

        module_logistics_action_minimum: {
            class: "Logistics.Action.Minimum",
            arguments: [
                "@data_game",
                "@module_logistics_room_creeps"
            ]
        },
        module_logistics_action_mine: {
            class: "Logistics.Action.Mine",
            arguments: [
                "@data_game",
                "@data_room",
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
        creep_executor: {
            class: "Creep.Execute.Action",
            arguments: [
                [
                    "@creep_action_none"
                    , "@creep_action_mine"
                ],
                "@module_logistics_room_creeps"
            ]
        },

        creep_action_none: {
            class: "Creep.Action.None"
        },
        creep_action_mine: {
            class: "Creep.Action.Mine",
            arguments: [
                "@module_logistics_action_mine"
                , "@data_room"
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
