"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("author");
    console.log(tableDefinition);
    if (!tableDefinition.name) {
      await queryInterface.sequelize.query(
        "ALTER TABLE author RENAME `fname` TO `name`",
      );
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
