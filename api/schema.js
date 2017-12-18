import * as GraphQLTools from "graphql-tools";
import Author from "./schema/author";
import Post from "./schema/post";
import PostTaxonomy from "./schema/postTaxonomy";
import AdjacentPosts from "./schema/AdjacentPosts";
import Taxonomy from "./schema/taxonomy";
import TaxonomyInputType from "./schema/taxonomyInputType";
import OptionInputType from "./schema/OptionInputType";
import FileInputType from "./schema/fileInputType";
import Setting from "./schema/setting";
import Media from "./schema/media";

import Sequalize from "sequelize";
import { conn } from "../config/mysql.config";
import {
    createPost,
    updatePost,
    PostModel,
    RoleModel,
    PermissionModel,
    AuthorModel,
    TaxonomyModel,
    PostTaxonomyModel,
    uploadFile,
    updateOptions,
    SettingsModel,
    MediaModel
} from "./models";

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
const PostNode = `
    type PostNode {
        count: Int,
        rows: [Post]
    }
`;
const MediaNode = `
    type MediaNode {
        count: Int,
        rows: [Media]
    }
`;

const PostMenuNode = `
    type PostMenuNode {
        count: Int,
        rows: [PostTaxonomy]
    }
`;
/*  the GraphQL schema definition  */

let definition = `
    schema {
        query:    Query
        mutation: Mutation
    }
    type Query {
        post(id: Int, type: String, slug: String): Post
        posts(type: String, body: String, status: String, offset: Int, limit: Int, cursor: Int): PostNode
        postsMenu(slug: String,type: String, name: String, postType: String): [PostTaxonomy]
        pageMenu(slug: String, name: String, postType: String): Post
        media(id: Int, author_id: Int!, offset: Int, limit: Int, cursor: Int): MediaNode
        adjacentPosts(type: String, slug:String): AdjacentPosts
        author(username: String!): Author
        authors: [Author]
        taxonomies(type: String, name: String): [Taxonomy]
        postTaxonomies(type: String, name: String, postType: String): [PostTaxonomy]
        settings(option: String):[Setting]
    }
    type Mutation {
        createPost(id: Int, title: String, body: String, author: String, excerpt: String, cover_image: String, type:                String, status: String, slug: String, taxonomies: [TaxonomyInputType]):Post
        updatePost(id: Int, title: String, body: String, author: String, excerpt: String, cover_image: String, type:                String, status: String, slug: String, taxonomies: [TaxonomyInputType]):Post
        uploadFile(id: Int, cover_image: String):Post
        updateOptions(options:[OptionInputType]): [Setting]
        insertMedia(url: String): Media
        deleteMedia(id: Int!): Media
    }
    
`;

/*  the GraphQL schema resolvers  */
let resolvers = {
    Mutation: {
        createPost: (root, args) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return createPost(data);
        },
        updatePost: (root, args, token) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return updatePost(data);
        },
        uploadFile: (root, args) => {
            return updatePost(args);
        },
        updateOptions: (root, args) => {
            return updateOptions(args).then(() => {
                return SettingsModel.findAll();
            });
        },
        insertMedia: (root, args) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return MediaModel.create(data);
        },
        deleteMedia: (root, args) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return MediaModel.destroy(data);
        }
    },
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
        author: (root, args) => {
            return AuthorModel.findOne({ where: args });
        },
        authors: (root, args) => {
            return AuthorModel.findAll({ where: args });
        },
        media: (root, args) => {
            let columns = Object.keys(PostModel.rawAttributes);
            let conditions = getConditions(columns, args);

            return MediaModel.count(conditions).then(count => {
                if (args.cursor) {
                    conditions.where.id = { gt: args.cursor };
                }
                return MediaModel.findAll(conditions).then(res => {
                    return {
                        count: count,
                        rows: res
                    };
                });
            });
        },
        taxonomies: (root, args) => {
            return TaxonomyModel.findAll({ where: args });
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
                            id: {
                                $lt: postId
                            },
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
                    debugger;
                    return data;
                });
        },
        settings: (root, args) => {
            return SettingsModel.findAll({ where: args });
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
    },
    Author: {
        role: author => {
            return author.getRole();
        }
    },
    Role: {
        permissions: role => {
            return role.getPermission();
        }
    }
};

/*  generate executable GraphQL schema  */
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [
        definition,
        Author,
        Post,
        Media,
        MediaNode,
        PostNode,
        PostMenuNode,
        PostTaxonomy,
        AdjacentPosts,
        Taxonomy,
        Setting,
        TaxonomyInputType,
        OptionInputType
    ],
    resolvers: resolvers,
    allowUndefinedInResolve: false,
    printErrors: true,
    resolverValidationOptions: {
        requireResolversForArgs: true,
        requireResolversForNonScalar: false,
        requireResolversForAllFields: false
    }
});

export default schema;
