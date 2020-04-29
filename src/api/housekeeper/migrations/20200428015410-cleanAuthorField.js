"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("author");

    if (tableDefinition.fname) {
      await queryInterface.removeColumn("author", "lname");
      await queryInterface.removeColumn("author", "username");
      await queryInterface.renameColumn("author", "fname", "name");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("author", "lname", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("author", "username", {
      type: Sequelize.STRING,
    });
    await queryInterface.renameColumn("author", "name", "fname");
  },
};
