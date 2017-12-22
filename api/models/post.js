import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";
import { TaxonomyModel } from "./taxonomy";
import { PostTaxonomyModel } from "./postTaxonomy";
import { parseErrors } from "../../shared/util";
import slugify from "../../shared/slugify";
import siteConfig from "../../config/site.config";

export const PostModel = conn.define(
    "posts",
    {
        title: {
            type: Sequalize.STRING,
            defaultValue: siteConfig.default_title
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

export function createTestPost(post) {
    return PostModel.create(post).then(postObj => {
        let taxonomies = [new Promise(resolve => resolve())];
        if (args.taxonomies && args.taxonomies.length > 0) {
            taxonomies = args.taxonomies.map(taxonomy => {
                if (taxonomy.id != 0) {
                    return taxonomy;
                }
                return TaxonomyModel.create({
                    name: taxonomy.name,
                    type: taxonomy.type
                }).then(taxObj => {
                    return PostTaxonomyModel.create({
                        taxonomy_id: taxObj.id,
                        post_id: postObj.id
                    });
                });
            });
        }
        return Promise.all(taxonomies).then(result => {
            return post;
        });
    });
}

export async function _createPost(data) {
    data.author_id = 1;
    let title = data.title || siteConfig.default_slug;
    try {
        //  create the slug
        data.slug = await slugify(PostModel, title);

        const createdPost = await PostModel.create(data);

        await PostTaxonomyModel.create({
            taxonomy_id: 1,
            post_id: createdPost.id
        });

        var post = PostModel.findOne({ where: { id: createdPost.id } });
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

export async function _updatePost(post) {
    try {
        if (
            post.slug &&
            post.slug.indexOf(siteConfig.default_slug) === 0 &&
            post.title !== siteConfig.default_title
        ) {
            //  create the slug
            post.slug = await slugify(PostModel, post.title);
        }
        await PostModel.update(post, {
            where: { id: post.id }
        });
        let taxonomies = [new Promise(resolve => resolve())];

        if (post.taxonomies && post.taxonomies.length > 0) {
            let ids = post.taxonomies.map(tax => {
                return tax.id;
            });
            await PostTaxonomyModel.destroy({
                where: {
                    taxonomy_id: {
                        $notIn: ids
                    },
                    post_id: post.id
                }
            });
            await Promise.all(
                post.taxonomies.map(async taxonomy => {
                    if (taxonomy.id != 0) {
                        await PostTaxonomyModel.findOrCreate({
                            where: {
                                taxonomy_id: taxonomy.id,
                                post_id: post.id
                            }
                        });
                        return;
                    }
                    const taxItem = await TaxonomyModel.findOrCreate({
                        where: {
                            name: taxonomy.name,
                            type: taxonomy.type
                        }
                    });
                    taxonomy.id = taxItem.id;
                    await PostTaxonomyModel.findOrCreate({
                        where: {
                            taxonomy_id: taxItem[0].id,
                            post_id: post.id
                        }
                    });
                })
            );

            const updatedPost = await PostModel.findOne({
                where: { id: post.id }
            });
            return {
                ok: true,
                post: updatedPost,
                errors: []
            };
        }
    } catch (e) {
        console.log(e);
        return {
            ok: false,
            data: {},
            errors: parseErrors(e)
        };
    }
}
