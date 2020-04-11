"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      // prettier-ignore
      // eslint-disable-next-line quotes
      "UPDATE taxonomy SET `type`='post_tag' WHERE `type`=\"post_category\"",
      { logging: console.log },
    );
  },

  down: (queryInterface, Sequelize) => {
    // not available
  },
};
