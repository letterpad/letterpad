"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.all([
            queryInterface.addColumn("media", "name", Sequelize.STRING),
            queryInterface.addColumn("media", "description", Sequelize.STRING)
        ]);
    },

    down: function(queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.all([
            queryInterface.removeColumn("media", "name"),
            queryInterface.removeColumn("media", "description")
        ]);
    }
};
