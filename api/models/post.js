import Sequalize from "sequelize";
import { parseErrors } from "../../shared/util";
import slugify from "../../shared/slugify";
import config from "../../config";

export default (conn, DataTypes) => {
    const Post = conn.define(
        "posts",
        {
            title: {
                type: Sequalize.STRING,
                defaultValue: config.defaultTitle
            },
            body: {
                type: Sequalize.TEXT
            },
            excerpt: {
                type: Sequalize.STRING(400),
                defaultValue: ""
            },
            cover_image: {
                type: Sequalize.STRING,
                defaultValue: ""
            },
            type: {
                type: Sequalize.STRING,
                defaultValue: ""
            },
            status: {
                type: Sequalize.STRING,
                defaultValue: "draft"
            },
            slug: {
                type: Sequalize.STRING,
                defaultValue: ""
            }
        },
        {
            freezeTableName: true // Model tableName will be the same as the model name
        }
    );
    Post.associate = models => {
        //  n:m
        Post.belongsToMany(models.Taxonomy, {
            through: "PostTaxonomy",
            as: "taxonomies"
        });
        //  1:m
        Post.belongsTo(models.Author);
    };
    return Post;
};

export async function _createPost(data, models) {
    data.author_id = 1;
    let title = data.title || config.defaultSlug;
    try {
        //  create the slug
        data.slug = await slugify(models.Post, title);

        const newPost = await models.Post.create(data);
        const defaultTaxonomy = await models.Taxonomy.findOne({
            where: { id: 1 }
        });
        await newPost.addTaxonomy(defaultTaxonomy);

        var post = models.Post.findOne({ where: { id: newPost.id } });
        return {
            ok: true,
            post,
            errors: []
        };
    } catch (e) {
        var errors = parseErrors(e);
        return {
            ok: false,
            post: {},
            errors
        };
    }
}

export async function _updatePost(post, models) {
    try {
        if (
            post.slug &&
            post.slug.indexOf(config.defaultSlug) === 0 &&
            post.title !== config.defaulTitle
        ) {
            //  create the slug
            post.slug = await slugify(models.Post, post.title);
        }
        await models.Post.update(post, {
            where: { id: post.id }
        });
        const updatedPost = await models.Post.findOne({
            where: { id: post.id }
        });

        if (post.taxonomies && post.taxonomies.length > 0) {
            // remove the texonomy relation
            await updatedPost.setTaxonomies([]);
            await Promise.all(
                post.taxonomies.map(async taxonomy => {
                    let taxItem = null;
                    // add relation with existing taxonomies
                    if (taxonomy.id != 0) {
                        taxItem = await models.Taxonomy.findOne({
                            where: { id: taxonomy.id }
                        });
                        return await updatedPost.addTaxonomy(taxItem);
                    }
                    // taxonomies needs to be created
                    taxItem = await models.Taxonomy.findOrCreate({
                        where: {
                            name: taxonomy.name,
                            type: taxonomy.type
                        }
                    });

                    taxItem = await models.Taxonomy.find({
                        where: {
                            name: taxonomy.name,
                            type: taxonomy.type
                        }
                    });

                    // add relation
                    return await updatedPost.addTaxonomy(taxItem);
                })
            );
        }

        return {
            ok: true,
            post: updatedPost,
            errors: []
        };
    } catch (e) {
        return {
            ok: false,
            data: {},
            errors: parseErrors(e)
        };
    }
}
