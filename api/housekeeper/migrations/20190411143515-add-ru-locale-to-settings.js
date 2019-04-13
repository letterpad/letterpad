'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
        "UPDATE setting SET value='{\"en\":true,\"fr\":false,\"pl\":false,\"ru\":false}' WHERE option='locale'"
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE setting SET value='{\"en\":true,\"fr\":false,\"pl\":false}' WHERE option='locale'"
    )
  }
};
