"use strict";
const readingTime = require("reading-time");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Post");

    if (tableDefinition.reading_time) return Promise.resolve();
    await queryInterface.addColumn("Post", "reading_time", {
      type: Sequelize.STRING,
    });

    const posts = await queryInterface.sequelize.query(
      "SELECT md, id from post",
    );

    for (let i = 0; i < posts[0].length; i++) {
      const post = posts[0][i];
      const read = readingTime(post.md);

      await queryInterface.sequelize.query(
        "UPDATE post SET `reading_time`='" +
          read.text +
          "' WHERE `id`='" +
          post.id +
          "'",
      );
    }
    return true;
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("Post", "reading_time");
  },
};
