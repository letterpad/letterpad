"use strict";
const fs = require("fs");
const { subjects } = require("../src/graphql/db/seed/constants");
const verifyNewUser = fs.readFileSync(
  "./src/graphql/db/seed/email-templates/verifyNewUser.twig",
);

const verifyNewSubscriber = fs.readFileSync(
  "./src/graphql/db/seed/email-templates/verifyNewSubscriber.twig",
);

const forgotPassword = fs.readFileSync(
  "./src/graphql/db/seed/email-templates/forgotPassword.twig",
);

const newPost = fs.readFileSync(
  "./src/graphql/db/seed/email-templates/newPost.twig",
);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("emails");
    await queryInterface.createTable("emails", {
      template_id: {
        type: Sequelize.STRING(100),
        primaryKey: true,
      },
      subject: Sequelize.STRING(100),
      body: Sequelize.TEXT,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.bulkInsert("emails", [
      {
        template_id: "VERIFY_NEW_USER",
        subject: subjects.VERIFY_NEW_USER,
        body: verifyNewUser,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        template_id: "VERIFY_NEW_SUBSCRIBER",
        subject: subjects.VERIFY_NEW_SUBSCRIBER,
        body: verifyNewSubscriber,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        template_id: "FORGOT_PASSWORD",
        subject: subjects.FORGOT_PASSWORD,
        body: forgotPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        template_id: "NEW_POST",
        subject: subjects.NEW_POST,
        body: newPost,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("emails");
  },
};
