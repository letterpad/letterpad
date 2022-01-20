"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("media", "uploads");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("uploads", "media");
  },
};
