"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='site_logo'",
    );
    let value = src[0][0].value;
    try {
      // value is already json
      value = JSON.parse(value);
      value = JSON.stringify(value);
    } catch (e) {
      value = JSON.stringify({
        src: value,
        width: 200,
        height: 200,
      });
    }
    await queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE setting SET `value`='" + value + "' WHERE `option`=\"site_logo\"",
      { logging: console.log },
    );

    // site favicon
    const srcFav = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='site_favicon'",
    );
    let valueFav = srcFav[0][0].value;
    try {
      // value is already json
      valueFav = JSON.parse(valueFav);
      valueFav = JSON.stringify(valueFav);
    } catch (e) {
      valueFav = JSON.stringify({
        src: valueFav,
        width: 16,
        height: 16,
      });
    }
    await queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE setting SET `value`='" + valueFav + "' WHERE `option`=\"site_favicon\"",
      { logging: console.log },
    );

    // //  change menu structure
    // const menu = await queryInterface.sequelize.query(
    //   "SELECT value from setting WHERE option='menu'",
    // );
    // let parsedMenu = JSON.parse(menu[0][0].value);

    // parsedMenu.map(item => {
    //   item.label = item.title;
    //   item.original_name = item.title;
    //   delete item.title;

    //   return item;
    // });
    // return queryInterface.sequelize.query(
    //   // prettier-ignore
    //   // eslint-disable-next-line quotes
    //   "UPDATE setting SET `value`='" + JSON.stringify(parsedMenu) + "' WHERE `option`=\"menu\"",
    //   { logging: console.log },
    // );
  },

  down: async (queryInterface, Sequelize) => {
    const src = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='site_logo'",
    );
    let value = src;
    try {
      value = JSON.parse(value);
      return queryInterface.sequelize.query(
        // prettier-ignore
        // eslint-disable-next-line quotes
        "UPDATE setting SET `value`='" + value.src + "' WHERE `option`=\"site_logo\"",
        { logging: console.log },
      );
    } catch (e) {
      //
    }

    const srcFav = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='site_favicon'",
    );
    let valueFav = srcFav;
    try {
      valueFav = JSON.parse(valueFav);
      return queryInterface.sequelize.query(
        // prettier-ignore
        // eslint-disable-next-line quotes
        "UPDATE setting SET `value`='" + valueFav.src + "' WHERE `option`=\"site_favicon\"",
        { logging: console.log },
      );
    } catch (e) {
      //
    }

    //  change menu structure
    const menu = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='menu'",
    );
    let parsedMenu = JSON.parse(menu[0][0].value);

    parsedMenu.map(item => {
      item.title = item.label;
      item.original_name = item.title;
      delete item.label;

      return item;
    });
    return queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE setting SET `value`='" + JSON.stringify(parsedMenu) + "' WHERE `option`=\"menu\"",
      { logging: console.log },
    );
  },
};
