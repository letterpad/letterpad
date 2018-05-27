import Sequalize from "sequelize";

export default (conn, DataTypes) => {
    const PostTaxonomy = conn.define(
        "PostTaxonomy",
        {
            post_id: {
                type: Sequalize.INTEGER
            },
            taxonomy_id: {
                type: Sequalize.INTEGER
            }
        },
        {
            freezeTableName: true
        }
    );
    PostTaxonomy.associate = models => {
        PostTaxonomy.belongsTo(models.Post);
    };
    return PostTaxonomy;
};
