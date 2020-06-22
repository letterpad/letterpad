"use strict";
const readingTime = require("reading-time");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (!tableDefinition.scheduled_at) {
      await queryInterface.addColumn("Post", "scheduled_at", {
        type: Sequelize.DATE,
      });
    }
    if (!tableDefinition.md_draft) {
      await queryInterface.addColumn("Post", "md_draft", {
        type: Sequelize.TEXT,
        defaultValue: "",
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("Post", "md_draft");
  },
};
