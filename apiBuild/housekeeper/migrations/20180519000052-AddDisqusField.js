"use strict";

module.exports = {
    up: function up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("settings", [{
            option: "disqus_id",
            value: "",
            created_at: new Date(),
            updated_at: new Date()
        }], {
            logging: console.log
        });
    },

    down: function down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("settings", [{
            option: "disqus_id"
        }]);
    }
};