"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("post");

    if (!tableDefinition.mdPreview) return Promise.resolve();

    return [
      // Remove column mdPreview
      await queryInterface.removeColumn("post", "mode"),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("post", "mode", {
        type: Sequelize.STRING,
      }),
      // mdBody data cannot be added. Its gone... >> || <<
    ];
  },
};
