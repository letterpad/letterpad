"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='menu'",
    );
    let menu = JSON.parse(src[0][0].value);

    menu.map(item => {
      delete item.disabled;
      delete item.id;
      item.originalName = item.title;

      return menu;
    });
    return queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE setting SET `value`='" + JSON.stringify(menu) + "' WHERE `option`=\"menu\"",
      { logging: console.log },
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
