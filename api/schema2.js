import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLInputObjectType,
    GraphQLNonNull
} from "graphql";
import { conn } from "../config/mysql.config";
import Sequalize from "sequelize";
import {
    createPost,
    updatePost,
    PostModel,
    AuthorModel,
    TaxonomyModel,
    PostTaxonomyModel,
    uploadFile
} from "./models";

const Post = new GraphQLObjectType({
    name: "Post",
    description: "This represents a post",
    fields() {
        return {
            id: {
                type: GraphQLInt,
                resolve(post) {
                    return post.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve(post) {
                    return post.title;
                }
            },
            body: {
                type: GraphQLString,
                resolve(post) {
                    return post.body;
                }
            },
            author: {
                type: Author,
                resolve(post) {
                    return post.getAuthor();
                }
            },
            excerpt: {
                type: GraphQLString,
                resolve(post) {
                    return post.excerpt;
                }
            },
            cover_image: {
                type: GraphQLString,
                resolve(post) {
                    return post.cover_image;
                }
            },
            type: {
                type: GraphQLString,
                resolve(post) {
                    return post.type;
                }
            },
            status: {
                type: GraphQLString,
                resolve(post) {
                    return post.status;
                }
            },
            permalink: {
                type: GraphQLString,
                resolve(post) {
                    return post.permalink;
                }
            },
            taxonomies: {
                type: new GraphQLList(Taxonomy),
                resolve(post) {
                    return post.getTaxonomy();
                }
            },
            created_at: {
                type: GraphQLString,
                resolve(post) {
                    return post.created_at;
                }
            }
        };
    }
});

const Taxonomy = new GraphQLObjectType({
    name: "Taxonomy",
    description: "All taxonomies available for a post",
    fields() {
        return {
            id: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.id;
                }
            },
            name: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.name;
                }
            },
            type: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.type;
                }
            }
        };
    }
});

const PostTaxonomy = new GraphQLObjectType({
    name: "PostTaxonomy",
    description: "All taxonomies linked with a post",
    fields() {
        return {
            id: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.id;
                }
            },
            name: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.name;
                }
            },
            type: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.type;
                }
            },
            post_count: {
                type: GraphQLString,
                resolve(taxonomy) {
                    return taxonomy.post[0].dataValues.post_count;
                }
            }
        };
    }
});

const TaxonomyInputType = new GraphQLInputObjectType({
    name: "TaxonomyInputType",
    description: "All taxonomies available for a post",
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        type: {
            type: GraphQLString
        }
    }
});

const FileInputType = new GraphQLInputObjectType({
    name: "FileInputType",
    description: "All taxonomies available for a post",
    fields: {
        name: {
            type: GraphQLString
        },
        type: {
            type: GraphQLString
        },
        size: {
            type: GraphQLInt
        },
        path: {
            type: GraphQLString
        }
    }
});

const Author = new GraphQLObjectType({
    name: "Author",
    description: "Author of a particular Post",
    fields() {
        return {
            id: {
                type: GraphQLString,
                resolve(authors) {
                    return authors.id;
                }
            },
            username: {
                type: GraphQLString,
                resolve(authors) {
                    return authors.username;
                }
            },
            password: {
                type: GraphQLString,
                resolve(authors) {
                    return authors.password;
                }
            },
            email: {
                type: GraphQLString,
                resolve(authors) {
                    return authors.email;
                }
            }
        };
    }
});

// const PostTaxonomy = new GraphQLObjectType({
//     name: "PostTaxonomy",
//     description: "Relationship between post and taxonomy",
//     fields() {
//         return {
//             post_id: {
//                 type: GraphQLInt,
//                 resolve(taxonomy) {
//                     return taxonomy.post_id;
//                 }
//             },
//             taxonomy_id: {
//                 type: GraphQLInt,
//                 resolve(taxonomy) {
//                     return taxonomy.taxonomy_id;
//                 }
//             }
//         };
//     }
// });

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const Query = new GraphQLObjectType({
    name: "Query",
    description: "This is the root query",
    fields() {
        return {
            posts: {
                type: new GraphQLList(Post),
                args: {
                    id: {
                        type: GraphQLString
                    },
                    type: {
                        type: GraphQLString
                    },
                    body: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    let obj = {};
                    for (let field in args) {
                        obj[field] = IsJsonString(args[field])
                            ? JSON.parse(args[field])
                            : args[field];
                    }
                    return PostModel.findAll({ where: obj });
                }
            },
            post: {
                type: Post,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return PostModel.findOne({ where: args });
                }
            },
            authors: {
                type: new GraphQLList(Author),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    username: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return AuthorModel.findAll({ where: args });
                }
            },
            taxonomies: {
                type: new GraphQLList(Taxonomy),
                args: {
                    type: {
                        type: GraphQLString
                    },
                    name: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return TaxonomyModel.findAll({ where: args });
                }
            },
            postTaxonomies: {
                type: new GraphQLList(PostTaxonomy),
                args: {
                    type: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return TaxonomyModel.findAll({
                        attributes: ["name", "id", "type"],
                        include: [
                            {
                                model: PostModel,
                                attributes: [
                                    [
                                        Sequalize.fn(
                                            "COUNT",
                                            Sequalize.col("post.id")
                                        ),
                                        "post_count"
                                    ]
                                ],
                                as: "post",
                                required: true
                            }
                        ],
                        where: args,
                        group: ["taxonomy_id", "post_id"]
                    });
                }
            }
        };
    }
});
// A simple schema which includes a mutation.
// const UploadedFileType = new GraphQLObjectType({
//     name: "UploadedFile",
//     fields: {
//         originalname: { type: GraphQLString },
//         mimetype: { type: GraphQLString }
//     }
// });

let postArgs = {
    id: {
        type: GraphQLString
    },
    title: {
        type: GraphQLString
    },
    body: {
        type: GraphQLString
    },
    author: {
        type: GraphQLInt
    },
    excerpt: {
        type: GraphQLString
    },
    cover_image: {
        type: GraphQLString
    },
    type: {
        type: GraphQLString
    },
    status: {
        type: GraphQLString
    },
    permalink: {
        type: GraphQLString
    },
    taxonomies: {
        type: new GraphQLList(TaxonomyInputType)
    }
};

const Mutation = new GraphQLObjectType({
    name: "Mutations",
    description: "Functions to set stuff",
    fields() {
        return {
            createPost: {
                type: Post,
                description: "Create a new Post",
                args: postArgs,
                resolve(source, args) {
                    let data = {};
                    Object.keys(args).forEach(field => {
                        data[field] = args[field];
                    });
                    return createPost(data);
                }
            },
            updatePost: {
                type: Post,
                args: postArgs,
                resolve(source, args) {
                    let data = {};
                    Object.keys(args).forEach(field => {
                        data[field] = args[field];
                    });
                    return updatePost(data);
                }
            },
            uploadFile: {
                type: Post,
                args: {
                    id: {
                        type: GraphQLString
                    },
                    cover_image: {
                        type: GraphQLString
                    }
                },
                resolve(source, args) {
                    return updatePost(args);
                }
            }
        };
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default Schema;
