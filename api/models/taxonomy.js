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
    const { postType } = args;
    const newArgs = { ...args };
    delete newArgs.postType;
    delete newArgs.status;
    const where = postType ? { type: postType } : {};

    if (!user || !user.id) {
        where.status = "publish";
    }
    return models.Taxonomy.findAll({
        attributes: ["name", "id", "type"],
        include: [
            {
                model: models.Post,
                attributes: [
                    [
                        Sequalize.fn("COUNT", Sequalize.col("post.id")),
                        "post_count"
                    ]
                ],
                as: "post",
                where,
                required: true
            }
        ],
        where: newArgs,
        group: ["taxonomy_id", "post_id"]
    });
};
