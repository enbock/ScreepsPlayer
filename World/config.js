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
                "@data_room",
                "@creep_creator"
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