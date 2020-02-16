"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "setting",
      [
        {
          option: "google_analytics",
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
        option: "google_analytics",
      },
    ]);
  },
};
