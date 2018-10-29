"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    const tableName = "media";
    return Promise.all([
      queryInterface.describeTable(tableName).then(tableDefinition => {
        if (tableDefinition.name) return Promise.resolve();
        return queryInterface.addColumn(tableName, "name", {
          type: Sequelize.STRING,
        });
      }),
      queryInterface.describeTable(tableName).then(tableDefinition => {
        if (tableDefinition.description) return Promise.resolve();
        return queryInterface.addColumn(tableName, "description", {
          type: Sequelize.STRING,
        });
      }),
    ]);
  },

  down: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return Promise.all([
      queryInterface.removeColumn("media", "name"),
      queryInterface.removeColumn("media", "description"),
    ]);
  },
};
