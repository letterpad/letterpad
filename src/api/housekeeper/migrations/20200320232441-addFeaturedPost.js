"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (tableDefinition.featured) return Promise.resolve();
    return await queryInterface.addColumn("Post", "featured", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("Post", "featured");
  },
};
