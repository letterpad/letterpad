"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "setting",
      [
        {
          option: "site_logo",
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("setting", [
      {
        option: "site_logo",
      },
    ]);
  },
};
