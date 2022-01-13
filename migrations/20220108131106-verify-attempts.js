"use strict";

const colName = "verify_attempt_left";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("authors", colName, Sequelize.INTEGER);
    queryInterface.sequelize.query(`UPDATE authors SET ${colName}=3`);
    await queryInterface.addColumn("subscribers", colName, Sequelize.INTEGER);
    queryInterface.sequelize.query(`UPDATE subscribers SET ${colName}=3`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("authors", colName);
    await queryInterface.removeColumn("subscribers", colName);
  },
};
