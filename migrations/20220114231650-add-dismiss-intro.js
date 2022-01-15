"use strict";

const colName = "intro_dismissed";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("settings", colName, Sequelize.INTEGER);
    queryInterface.sequelize.query(`UPDATE settings SET ${colName}="false"`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("settings", colName);
  },
};
