"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("post");

    if (!tableDefinition.mdPreview) return Promise.resolve();

    return [
      await queryInterface.sequelize.query("UPDATE post SET body=html"),
      // Remove column mdPreview
      await queryInterface.removeColumn("post", "body"),
      // add column md
      await queryInterface.addColumn("post", "md"),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      // Copy column value of body into mdPreview.
      await queryInterface.sequelize.query("UPDATE post SET body=html"),
      // Add the columns
      await queryInterface.removeColumn("post", "html"),
      await queryInterface.removeColumn("post", "md"),
    ];
  },
};
