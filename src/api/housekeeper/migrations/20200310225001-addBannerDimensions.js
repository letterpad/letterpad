"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from \"Setting\" WHERE option='banner'",
      { logging: console.log },
    );
    let value = src[0][0].value;
    try {
      // value is already json
      value = JSON.parse(value);
      value = JSON.stringify(value);
    } catch (e) {
      value = JSON.stringify({
        src: value,
        width: 1000,
        height: 700,
      });
    }
    return queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE \"Setting\" SET value='" + value + "' WHERE option='banner'",
      { logging: console.log },
    );
  },

  down: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from \"Setting\" WHERE option='banner'",
    );
    let value = src;
    try {
      value = JSON.parse(value);
      return queryInterface.sequelize.query(
        // prettier-ignore
        // eslint-disable-next-line quotes
        "UPDATE \"Setting\" SET value='" + value.src + "' WHERE option=\"banner\"",
        { logging: console.log },
      );
    } catch (e) {
      //
    }
  },
};
