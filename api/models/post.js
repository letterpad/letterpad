import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";
import { TaxonomyModel } from "./taxonomy";
import { PostTaxonomyModel } from "./postTaxonomy";

export const PostModel = conn.define(
    "posts",
    {
        title: {
            type: Sequalize.STRING,
            defaultValue: ""
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

export function _createPost(data) {
    data.author_id = 1;
    let title = data.title;
    if (title) {
        data.slug = title
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-*|-*$/g, "")
            .toLowerCase();
    }

    return PostModel.create(data)
        .then(postObj => {
            return PostTaxonomyModel.create({
                taxonomy_id: 1,
                post_id: postObj.id
            }).then(() => {
                return postObj;
            });
        })
        .then(postObj => {
            return PostModel.findOne({ where: { id: postObj.id } });
        });
}

export function _updatePost(post) {
    let title = post.title;
    if (title) {
        post.slug = title
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-*|-*$/g, "")
            .toLowerCase();
    }
    return PostModel.update(post, {
        where: { id: post.id }
    })
        .then(updatePostResult => {
            //delete extra taxonomies
            if (post.taxonomies && post.taxonomies.length > 0) {
                let ids = post.taxonomies.map(tax => {
                    return tax.id;
                });
                return PostTaxonomyModel.destroy({
                    where: {
                        taxonomy_id: {
                            $notIn: ids
                        },
                        post_id: post.id
                    }
                }).then(() => {
                    return updatePostResult;
                });
            } else {
                return updatePostResult;
            }
        })
        .then(updatePostResult => {
            let taxonomies = [new Promise(resolve => resolve())];
            if (post.taxonomies && post.taxonomies.length > 0) {
                taxonomies = post.taxonomies.map(taxonomy => {
                    if (taxonomy.id != 0) {
                        return PostTaxonomyModel.findOrCreate({
                            where: {
                                taxonomy_id: taxonomy.id,
                                post_id: post.id
                            }
                        });
                    }
                    return TaxonomyModel.findOrCreate({
                        where: {
                            name: taxonomy.name,
                            type: taxonomy.type
                        }
                    })
                        .then(result => {
                            taxonomy.id = result.id;
                            return result;
                        })
                        .then(result => {
                            return PostTaxonomyModel.findOrCreate({
                                where: {
                                    taxonomy_id: result[0].id,
                                    post_id: post.id
                                }
                            });
                        });
                });
            }
            return Promise.all(taxonomies).then(result => {
                return post;
            });
        })
        .then(() => {
            return PostModel.findOne({ where: { id: post.id } });
        });
}
