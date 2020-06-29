"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (!tableDefinition.mdPreview) return Promise.resolve();

    return [
      await queryInterface.sequelize.query("UPDATE Post SET body=html"),
      // Remove column mdPreview
      await queryInterface.removeColumn("Post", "body"),
      // add column md
      await queryInterface.addColumn("Post", "md"),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      // Copy column value of body into mdPreview.
      await queryInterface.sequelize.query("UPDATE Post SET body=html"),
      // Add the columns
      await queryInterface.removeColumn("Post", "html"),
      await queryInterface.removeColumn("Post", "md"),
    ];
  },
};
