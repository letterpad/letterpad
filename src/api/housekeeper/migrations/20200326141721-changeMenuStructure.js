"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from \"Setting\" WHERE option='menu'",
    );
    let menu = JSON.parse(src[0][0].value);

    menu.map(item => {
      delete item.disabled;
      delete item.id;
      item.original_name = item.title;

      return item;
    });
    return queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE \"Setting\" SET value='" + JSON.stringify(menu) + "' WHERE option='menu'",
      { logging: console.log },
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
