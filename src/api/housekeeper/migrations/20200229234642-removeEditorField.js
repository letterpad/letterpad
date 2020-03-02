"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("setting", [
      {
        option: "editor",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "setting",
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
