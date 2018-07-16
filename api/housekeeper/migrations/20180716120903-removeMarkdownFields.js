"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            // Copy column value of markdownPreview into body.
            await queryInterface.sequelize.query(
                "UPDATE post SET body=mdPreview WHERE mode='markdown'"
            ),
            // Remove column mdPreview
            await queryInterface.removeColumn("post", "mdPreview"),
            // remove column mdBody
            await queryInterface.removeColumn("post", "mdBody")
        ];
    },

    down: async (queryInterface, Sequelize) => {
        return [
            // Add the columns
            await queryInterface.addColumn("post", "mdPreview", {
                type: Sequelize.STRING
            }),
            await queryInterface.addColumn("post", "mdBody", {
                type: Sequelize.STRING
            }),
            // mdBody data cannot be added. Its gone... >> || <<

            // Copy column value of body into mdPreview.
            await queryInterface.sequelize.query(
                "UPDATE post SET mdPreview=body WHERE mode='markdown'"
            )
        ];
    }
};
