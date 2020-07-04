"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (!tableDefinition.mdPreview) return Promise.resolve();

    return [
      // Copy column value of markdownPreview into body.
      await queryInterface.sequelize.query(
        "UPDATE Post SET body=mdPreview WHERE mode='markdown'",
      ),
      // Remove column mdPreview
      await queryInterface.removeColumn("Post", "mdPreview"),
      // remove column mdBody
      await queryInterface.removeColumn("Post", "mdBody"),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      // Add the columns
      await queryInterface.addColumn("Post", "mdPreview", {
        type: Sequelize.STRING,
      }),
      await queryInterface.addColumn("Post", "mdBody", {
        type: Sequelize.STRING,
      }),
      // mdBody data cannot be added. Its gone... >> || <<

      // Copy column value of body into mdPreview.
      await queryInterface.sequelize.query(
        "UPDATE Post SET mdPreview=body WHERE mode='markdown'",
      ),
    ];
  },
};
