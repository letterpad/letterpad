"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition.width) return Promise.resolve();

    return [
      // add column md
      await queryInterface.addColumn("media", "width", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("media", "height", {
        type: Sequelize.INTEGER,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("media", "width"),
      await queryInterface.removeColumn("media", "height"),
    ];
  },
};
