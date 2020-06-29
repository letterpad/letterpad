"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (tableDefinition.cover_image_width) return Promise.resolve();

    return [
      await queryInterface.addColumn("Post", "cover_image_width", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("Post", "cover_image_height", {
        type: Sequelize.INTEGER,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("Post", "cover_image_width"),
      await queryInterface.removeColumn("Post", "cover_image_height"),
    ];
  },
};
