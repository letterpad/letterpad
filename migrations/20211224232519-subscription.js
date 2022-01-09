"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("subscribers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(100),
      },
      author_id: Sequelize.INTEGER,
      verified: Sequelize.BOOLEAN,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("subscribersDelivery", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subscriber_id: Sequelize.STRING(100),
      post_id: Sequelize.INTEGER(10),
      delivered: Sequelize.BOOLEAN,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("subscribers");
    await queryInterface.dropTable("subscribersDelivery");
  },
};
