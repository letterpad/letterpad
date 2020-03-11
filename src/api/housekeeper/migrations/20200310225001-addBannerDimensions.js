"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='banner'",
    );

    const value = JSON.stringify({
      src: src[0][0].value,
      width: 100,
      height: 100,
    });
    console.log("value :", value);
    return queryInterface.sequelize.query(
      `
      UPDATE setting SET value="${value}" WHERE option="banner"
      `,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.update("setting", [
      {
        option: "site_favicon",
      },
    ]);
  },
};
