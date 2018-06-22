import { parseErrors, recurseMenu } from "../../shared/util";
import slugify from "../../shared/slugify";
import config from "../../config";
import moment from "moment";

export default (conn, DataTypes) => {
    const Post = conn.define(
        "post",
        {
            title: {
                type: DataTypes.STRING,
                defaultValue: config.defaultTitle
            },
            mode: {
                type: DataTypes.STRING,
                defaultValue: "rich-text"
            },
            body: {
                type: DataTypes.TEXT
            },
            mdBody: {
                type: DataTypes.TEXT
            },
            mdPreview: {
                type: DataTypes.TEXT
            },
            excerpt: {
                type: DataTypes.STRING(400),
                defaultValue: ""
            },
            cover_image: {
                type: DataTypes.STRING,
                defaultValue: ""
            },
            type: {
                type: DataTypes.STRING,
                defaultValue: ""
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "draft"
            },
            slug: {
                type: DataTypes.STRING,
                defaultValue: ""
            },
            published_at: {
                type: DataTypes.DATE
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
        Post.hasMany(models.PostTaxonomy);
        //  1:m
        Post.belongsTo(models.Author);
    };
    return Post;
};

export async function _createPost(data, models) {
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
        // first get the post which is being updated
        const oldPost = await models.Post.findOne({
            where: { id: post.id }
        });

        // Create a new slug if the title changes.
        if (post.title && post.title !== oldPost.title) {
            //  create the slug
            post.slug = await slugify(models.Post, post.title);
        }

        // check the menu. the menu has page items. update the slug of the page menu item if it exist.

        let menu = await models.Setting.findOne({
            where: { option: "menu" }
        });

        const changeMenuItem = item => {
            if (item.type == "page") {
                item.slug = post.slug;
            }
            return item;
        };
        // loop though the menu and find the item with the current slug and id.
        // if found, update the slug
        const updatedMenu = JSON.parse(menu.value).map(item =>
            recurseMenu(item, post.id, changeMenuItem)
        );

        try {
            const updated = await models.Setting.update(
                { value: JSON.stringify(updatedMenu) },
                { where: { option: "menu" } }
            );
        } catch (e) {
            console.log(e);
        }

        // If this post is being published for the first time, update the publish date
        if (post.status == "publish" && oldPost.status == "draft") {
            post.published_at = moment
                .utc(new Date())
                .format("YYYY-MM-DD HH:mm:ss");
        }
        await models.Post.update(post, {
            where: { id: post.id }
        });

        // get all values of the updated post
        const newPost = await models.Post.findOne({
            where: { id: post.id }
        });

        // the taxonomies like tags/cathegories might have chqnged or added.
        // sync them
        if (post.taxonomies && post.taxonomies.length > 0) {
            // remove the texonomy relation
            await newPost.setTaxonomies([]);
            await Promise.all(
                post.taxonomies.map(async taxonomy => {
                    let taxItem = null;
                    // add relation with existing taxonomies
                    if (taxonomy.id != 0) {
                        taxItem = await models.Taxonomy.findOne({
                            where: { id: taxonomy.id }
                        });
                        return await newPost.addTaxonomy(taxItem);
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
                    return await newPost.addTaxonomy(taxItem);
                })
            );
        }

        return {
            ok: true,
            post: newPost,
            errors: []
        };
    } catch (e) {
        console.log(e);
        return {
            ok: false,
            data: {},
            errors: parseErrors(e)
        };
    }
}
