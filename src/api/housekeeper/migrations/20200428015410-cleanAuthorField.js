"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Author");
    if (!tableDefinition.name) {
      await queryInterface.sequelize.query(
        'ALTER TABLE "Author" RENAME fname TO name',
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Author", "lname", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Author", "username", {
      type: Sequelize.STRING,
    });
    await queryInterface.renameColumn("Author", "name", "fname");
  },
};
