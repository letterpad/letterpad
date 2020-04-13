"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Navigation", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label: {
        type: Sequelize.STRING,
      },
      original_name: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM("tag", "page", "custom"),
      },
      slug: {
        type: Sequelize.STRING,
      },
    });

    // insert data in navigation table:
    const src = await queryInterface.sequelize.query(
      "SELECT value from setting WHERE option='menu'",
    );
    let menu = JSON.parse(src[0][0].value);

    const menuItems = menu.map(item => {
      item.label = item.title;
      delete item.title;
      if (item.type === "category") {
        item.type = "tag";
      }
      return item;
    });
    await queryInterface.bulkInsert("Navigation", [...menuItems], {});

    await queryInterface.sequelize.query(
      "DELETE FROM setting WHERE option='menu'",
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Navigation");
  },
};
