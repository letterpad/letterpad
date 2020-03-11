"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("post");

    if (tableDefinition.cover_image_width) return Promise.resolve();

    return [
      await queryInterface.addColumn("post", "cover_image_width", {
        type: Sequelize.INTEGER,
      }),
      await queryInterface.addColumn("post", "cover_image_height", {
        type: Sequelize.INTEGER,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("post", "cover_image_width"),
      await queryInterface.removeColumn("post", "cover_image_height"),
    ];
  },
};
