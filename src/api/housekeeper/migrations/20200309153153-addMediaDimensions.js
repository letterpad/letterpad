"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Media");

    if (tableDefinition.width) return Promise.resolve();

    return [
      // add column md
      await queryInterface.addColumn("Media", "width", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("Media", "height", {
        type: Sequelize.INTEGER,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("Media", "width"),
      await queryInterface.removeColumn("Media", "height"),
    ];
  },
};
