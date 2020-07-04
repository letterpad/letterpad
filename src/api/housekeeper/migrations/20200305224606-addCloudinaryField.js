"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Setting",
      [
        {
          option: "cloudinary_key",
          value: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          option: "cloudinary_name",
          value: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          option: "cloudinary_secret",
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
        option: "cloudinary_key",
      },
      {
        option: "cloudinary_name",
      },
      {
        option: "cloudinary_secret",
      },
    ]);
  },
};
