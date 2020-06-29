"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (!tableDefinition.mdPreview) return Promise.resolve();

    return [
      // Remove column mdPreview
      await queryInterface.removeColumn("Post", "mode"),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("Post", "mode", {
        type: Sequelize.STRING,
      }),
      // mdBody data cannot be added. Its gone... >> || <<
    ];
  },
};
