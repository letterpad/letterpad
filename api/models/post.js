import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";
import { TaxonomyModel } from "./taxonomy";
import { PostTaxonomyModel } from "./postTaxonomy";

export const PostModel = conn.define(
    "posts",
    {
        title: {
            type: Sequalize.STRING
        },
        body: {
            type: Sequalize.STRING
        },
        excerpt: {
            type: Sequalize.STRING
        },
        cover_image: {
            type: Sequalize.STRING
        },
        type: {
            type: Sequalize.STRING
        },
        status: {
            type: Sequalize.STRING
        },
        permalink: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

export function createPost(post) {
    return PostModel.create(post).then(postObj => {
        let taxonomies = [new Promise(resolve => resolve())];
        if (args.taxonomies && args.taxonomies.length > 0) {
            taxonomies = args.taxonomies.map(taxonomy => {
                if (taxonomy.id != 0) {
                    return taxonomy;
                }
                return TaxonomyModel
                    .create({
                        name: taxonomy.name,
                        type: taxonomy.type
                    })
                    .then(taxObj => {
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

export function updatePost(post) {
    return PostModel
        .update(post, {
            where: { id: post.id }
        })
        .then(updatePostResult => {
            //delete extra taxonomies
            if (post.taxonomies && post.taxonomies.length > 0) {
                let ids = post.taxonomies.map(tax => {
                    return tax.id;
                });
                return PostTaxonomyModel
                    .destroy({
                        where: {
                            taxonomy_id: {
                                $notIn: ids
                            },
                            post_id: post.id
                        }
                    })
                    .then(() => {
                        return updatePostResult;
                    });
            } else {
                return updatePostResult;
            }
        })
        .then(updatePostResult => {
            debugger;
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
                    return TaxonomyModel
                        .findOrCreate({
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
        }).finally(() => {
            debugger;
            return PostModel.findAll({where:{id:post.id}});
        });
}
