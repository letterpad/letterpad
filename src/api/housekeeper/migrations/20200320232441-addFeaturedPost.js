"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("post");

    if (tableDefinition.featured) return Promise.resolve();
    return await queryInterface.addColumn("post", "featured", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("post", "featured");
  },
};
