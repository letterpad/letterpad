// import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export default (conn, DataTypes) => {
    const Taxonomy = conn.define(
        "taxonomies",
        {
            name: {
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
    console.log(where);
    console.log("=================");
    let query = {
        attributes: ["name", "id", "type"],
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
        where: { type },
        group: ["taxonomy_id", "post_id"]
    };
    if (taxId) {
        query.where.id = taxId;
    }
    return models.Taxonomy.findAll(query);
};
