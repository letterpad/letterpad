import Sequalize from "sequelize";

export default (conn, DataTypes) => {
    const Taxonomy = conn.define(
        "taxonomies",
        {
            name: {
                type: Sequalize.STRING
            },
            desc: {
                type: Sequalize.STRING
            },
            slug: {
                type: Sequalize.STRING
            },
            type: {
                type: Sequalize.STRING
            }
        },
        {
            freezeTableName: true // Model tableName will be the same as the model name
        }
    );

    Taxonomy.associate = models => {
        Taxonomy.belongsToMany(models.Post, {
            through: "PostTaxonomy"
        });
    };
    return Taxonomy;
};
