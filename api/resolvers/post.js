import {
    _createPost,
    _updatePost,
    MediaModel,
    PostModel,
    SettingsModel,
    TaxonomyModel
} from "../models";

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getConditions(columns, args) {
    let obj = {};
    let conditions = {};
    for (let field in args) {
        if (columns.indexOf(field) >= 0) {
            obj[field] = IsJsonString(args[field])
                ? JSON.parse(args[field])
                : args[field];
        } else {
            conditions[field] = args[field];
        }
    }
    conditions.where = obj;
    return conditions;
}

export default {
    Query: {
        posts: (root, args, context) => {
            let columns = Object.keys(PostModel.rawAttributes);
            let conditions = getConditions(columns, args);
            return PostModel.count(conditions).then(count => {
                if (args.cursor) {
                    conditions.where.id = { gt: args.cursor };
                }
                return PostModel.findAll(conditions).then(res => {
                    return {
                        count: count,
                        rows: res
                    };
                });
            });
        },
        post: (root, args) => {
            return PostModel.findOne({ where: args });
        },
        postsMenu: (root, args) => {
            let that = this;
            return SettingsModel.findOne({ where: { option: "menu" } })
                .then(menu => {
                    let t = menu.dataValues.value;
                    return JSON.parse(t);
                })
                .then(menu => {
                    let item = menu.filter(item => {
                        if (item.slug == args.slug) {
                            return item;
                        }
                    });
                    return TaxonomyModel.findOne({
                        where: { id: item[0].id }
                    }).then(taxonomy => {
                        return resolvers.Query.postTaxonomies(root, {
                            type: "post_category",
                            name: taxonomy.dataValues.name,
                            postType: "post"
                        });
                    });
                });
        },
        pageMenu: (root, args) => {
            let that = this;
            return SettingsModel.findOne({ where: { option: "menu" } })
                .then(menu => {
                    let t = menu.dataValues.value;
                    return JSON.parse(t);
                })
                .then(menu => {
                    let item = menu.filter(item => {
                        if (item.slug == args.slug) {
                            return item;
                        }
                    });
                    return PostModel.findOne({
                        where: { id: item[0].id }
                    });
                });
        },
        adjacentPosts: (root, args) => {
            let data = {
                previous: {},
                next: {}
            };
            return PostModel.findOne({ where: args })
                .then(post => {
                    if (post === null) {
                        throw new Error("Invalid query");
                    }
                    return post.dataValues.id;
                })
                .then(postId => {
                    return PostModel.findOne({
                        where: {
                            id: { $lt: postId },
                            type: args.type
                        },
                        order: [["id", "DESC"]],
                        limit: 1
                    })
                        .then(post => {
                            data.previous = post;
                        })
                        .then(() => {
                            return PostModel.findOne({
                                where: {
                                    id: {
                                        $gt: postId
                                    },
                                    type: args.type
                                },
                                order: [["id", "ASC"]],
                                limit: 1
                            });
                        })
                        .then(post => {
                            data.next = post;
                            return data;
                        });
                })
                .then(data => {
                    return data;
                });
        },
        postTaxonomies: (root, args) => {
            let postType = args.postType;
            delete args.postType;
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
                        where: postType ? { type: postType } : {},
                        required: true
                    }
                ],
                where: args,
                group: ["taxonomy_id", "post_id"]
            });
        }
    },
    Mutation: {
        createPost: (root, args) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return _createPost(data);
        },
        updatePost: (root, args, token) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return _updatePost(data);
        },
        uploadFile: (root, args) => {
            return _updatePost(args);
        }
    },
    Post: {
        author: post => {
            return post.getAuthor();
        },
        taxonomies: post => {
            return post.getTaxonomy();
        }
    },
    PostTaxonomy: {
        posts: (taxonomy, { type }) => {
            return taxonomy.getPost({ where: { type: type } });
        },
        post_count: taxonomy => {
            return taxonomy.post[0].dataValues.post_count;
        }
    }
};
