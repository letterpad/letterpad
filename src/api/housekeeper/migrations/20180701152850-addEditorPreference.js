"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Setting",
      [
        {
          option: "editor",
          value: "richtext",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        logging: console.log,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Setting", [
      {
        option: "editor",
      },
    ]);
  },
};
