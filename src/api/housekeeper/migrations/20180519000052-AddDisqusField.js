"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Setting",
      [
        {
          option: "disqus_id",
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
    return queryInterface.bulkDelete("Setting", [
      {
        option: "disqus_id",
      },
    ]);
  },
};
