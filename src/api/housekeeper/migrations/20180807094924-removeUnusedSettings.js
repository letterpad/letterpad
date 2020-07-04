"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Setting", [
      {
        option: "editor",
      },
      {
        option: "sidebar_about",
      },
      {
        option: "sidebar_latest_post_count",
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
        {
          option: "sidebar_about",
          value: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          option: "sidebar_latest_post_count",
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
