"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Setting", [
      {
        option: "editor",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Setting",
      [
        {
          option: "editor",
          value: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        logging: console.log,
      },
    );
  },
};
