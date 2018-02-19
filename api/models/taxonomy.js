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
export const getTaxonomies = (root, args, { models, user }) => {
    let { postType, type, taxId, status } = args;

    let where = {};
    if (!user || !user.id) {
        where.status = "publish";
    }
    if (postType) {
        where.type = postType;
    }

    let query = {
        attributes: ["name", "id", "type", "slug"],
        include: [
            {
                model: models.Post,
                attributes: [
                    [
                        Sequalize.fn("COUNT", Sequalize.col("posts.id")),
                        "post_count"
                    ]
                ],
                as: "posts",
                where,
                required: true
            }
        ],
        order: [["name", "ASC"]],
        where: { type },
        group: ["taxonomy_id", "post_id"]
    };
    if (taxId) {
        query.where.id = taxId;
    }
    return models.Taxonomy.findAll(query);
};
