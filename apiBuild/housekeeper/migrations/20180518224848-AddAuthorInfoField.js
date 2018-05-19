"use strict";

module.exports = {
    up: function up(queryInterface, Sequelize) {
        /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.
        Example:
        return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return queryInterface.bulkInsert("settings", [{
            option: "displayAuthorInfo",
            value: "1",
            created_at: new Date(),
            updated_at: new Date()
        }], {
            logging: console.log
        });
    },

    down: function down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("settings", [{
            option: "displayAuthorInfo"
        }]);
    }
};