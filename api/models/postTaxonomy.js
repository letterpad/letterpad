export default (conn, DataTypes) => {
    const PostTaxonomy = conn.define(
        "PostTaxonomy",
        {
            post_id: {
                type: DataTypes.INTEGER
            },
            taxonomy_id: {
                type: DataTypes.INTEGER
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
