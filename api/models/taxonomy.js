import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";
import { PostModel } from "./post";

export const TaxonomyModel = conn.define(
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

export const getTaxonomies = (root, args, context) => {
    let postType = args.postType;
    delete args.postType;
    delete args.status;
    let where = postType ? { type: postType } : {};

    if (!context.user || !context.user.id) {
        where.status = "publish";
    }
    return TaxonomyModel.findAll({
        attributes: ["name", "id", "type"],
        include: [
            {
                model: PostModel,
                attributes: [
                    [
                        Sequalize.fn("COUNT", Sequalize.col("post.id")),
                        "post_count"
                    ]
                ],
                as: "post",
                where: where,
                required: true
            }
        ],
        where: args,
        group: ["taxonomy_id", "post_id"]
    });
};
