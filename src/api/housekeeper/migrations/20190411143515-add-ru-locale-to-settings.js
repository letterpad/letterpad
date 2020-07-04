"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.sequelize.query(
    //   'UPDATE Setting SET value=\'{"en":true,"fr":false,"pl":false,"ru":false}\' WHERE \'option\'=\'locale\'',
    // );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      "UPDATE Setting SET value='{\"en\":true,\"fr\":false,\"pl\":false}' WHERE 'option'='locale'",
    );
  },
};
