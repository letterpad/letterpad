"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "setting",
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
    return queryInterface.bulkDelete("setting", [
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
