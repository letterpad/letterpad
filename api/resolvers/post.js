import Sequalize from "sequelize";
import { _createPost, _updatePost } from "../models/post";
import { getTaxonomies } from "../models/taxonomy";
import { UnauthorizedError } from "../utils/common";
import {
    requiresAdmin,
    checkDisplayAccess,
    createPostsPerm,
    editPostPerm
} from "../utils/permissions";

function IsJsonString(str) {
    if (!isNaN(str)) return false;
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getConditions(columns, args) {
    const obj = {};
    const conditions = {};
    for (const field in args) {
        if (columns.indexOf(field) >= 0) {
            const validateJSONStr = IsJsonString(args[field]);
            const query = validateJSONStr
                ? JSON.parse(args[field])
                : args[field];
            if (validateJSONStr) {
                obj["$or"] = [{ body: query }, { title: query }];
            } else {
                obj[field] = query;
            }
        } else {
            conditions[field] = args[field];
        }
    }
    conditions.where = obj;
    return conditions;
}

export default {
    Query: {
        posts: checkDisplayAccess.createResolver((root, args, { models }) => {
            const newArgs = { ...args };

            if (newArgs.status == "all") {
                newArgs.status = { not: "trash" };
            }

            const columns = Object.keys(models.Post.rawAttributes);
            const conditions = getConditions(columns, newArgs);
            if (newArgs.status) {
                conditions.where.status = newArgs.status;
            }
            return models.Post.count(conditions).then(count => {
                if (newArgs.cursor) {
                    conditions.where.id = { gt: newArgs.cursor };
                }
                conditions.order = [["id", "DESC"]];

                return models.Post.findAll(conditions).then(res => {
                    return {
                        count,
                        rows: res
                    };
                });
            });
        }),
        post: checkDisplayAccess.createResolver((root, args, { models }) => {
            return models.Post.findOne({ where: args });
        }),
        postsMenu: async (root, args, { models, user }) => {
            let menu = await models.Setting.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);

            let menuItem = null;
            const getItemFromMenu = (arr, slug) => {
                const a = arr.some(item => {
                    if (item.slug && item.slug == slug) {
                        menuItem = item;
                    }
                    if (item.children && item.children.length > 0) {
                        getItemFromMenu(item.children, slug);
                    }
                });
            };
            getItemFromMenu(menu, args.slug);

            let id = null;

            if (!menuItem) {
                const taxonomy = await models.Taxonomy.findOne({
                    where: { slug: args.slug, type: args.type }
                });
                if (taxonomy) {
                    id = taxonomy.dataValues.id;
                } else {
                    return {
                        count: 0,
                        posts: []
                    };
                }
            } else {
                [id] = menuItem.id.split(/-(.+)/);
            }
            const taxonomies = await getTaxonomies(
                root,
                {
                    type: "post_category",
                    taxId: id,
                    postType: args.postType,
                    status: "publish"
                },
                { user, models }
            );
            if (taxonomies.length === 0) {
                return {
                    count: 0,
                    posts: []
                };
            }
            const conditions = {
                where: { type: args.postType, status: "publish" }
            };

            if ("limit" in args) {
                conditions.limit = args.limit;
            }
            if ("offset" in args) {
                conditions.offset = args.offset;
            }
            conditions.order = [["id", "DESC"]];
            return {
                count: taxonomies[0].dataValues.posts.length,
                posts: await models.Post.findAll(conditions)
            };
        },
        pageMenu: async (root, args, { models }) => {
            let menu = await models.Setting.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);

            let menuItem = null;
            const getItemFromMenu = (arr, slug) => {
                return arr.some(item => {
                    if (item.slug && item.slug == slug) {
                        menuItem = item;
                    }
                    if (item.children && item.children.length > 0) {
                        getItemFromMenu(item.children, slug);
                    }
                });
            };
            getItemFromMenu(menu, args.slug);
            args.status = "publish";
            const response = {
                ok: true,
                post: null,
                errors: []
            };
            if (!menuItem) {
                const page = await models.Post.findOne({
                    where: { type: "page", slug: args.slug }
                });
                if (page) {
                    response.post = page;
                } else {
                    response.ok = false;
                    response.errors = [
                        {
                            path: "pageMenu",
                            message: "Page not found"
                        }
                    ];
                }
                return response;
            }

            const page = await models.Post.findOne({
                where: { id: menuItem.id }
            });
            response.post = page;
            return response;
        },
        adjacentPosts: async (root, args, { models }) => {
            let data = {
                previous: {},
                next: {}
            };
            args.status = "publish";
            const postCheck = await models.Post.findOne({ where: args });
            if (postCheck === null) {
                throw new Error("Invalid query");
            }
            const newArgs = { ...args };
            delete newArgs.slug;
            const prevPost = await models.Post.findOne({
                where: {
                    ...newArgs,
                    id: { $lt: postCheck.dataValues.id }
                },
                order: [["id", "DESC"]],
                limit: 1
            });
            data.previous = prevPost;
            const nextPost = await models.Post.findOne({
                where: {
                    ...newArgs,
                    id: {
                        $gt: postCheck.dataValues.id
                    }
                },
                order: [["id", "ASC"]],
                limit: 1
            });
            data.next = nextPost;
            return data;
        },
        postTaxonomies: checkDisplayAccess.createResolver(
            async (root, args, context) => {
                const taxonomies = await getTaxonomies(root, args, context);
                return {
                    count: taxonomies[0].dataValues.posts.length,
                    posts: taxonomies[0].dataValues.posts
                };
            }
        ),
        postsByTaxSlug: checkDisplayAccess.createResolver(
            async (root, args, context) => {
                const taxonomies = await getTaxonomies(root, args, context);
                const conditions = {
                    where: { type: args.postType, status: "publish" }
                };

                if (args.limit) {
                    conditions.limit = args.limit;
                }
                if (args.offset) {
                    conditions.offset = args.offset;
                }
                return {
                    count: taxonomies[0].dataValues.posts.length,
                    posts: await context.models.Post.findAll(conditions)
                };
            }
        ),
        stats: async (root, args, { models }) => {
            const result = {
                posts: { published: 0, drafts: 0 },
                pages: { published: 0, drafts: 0 },
                tags: 0,
                categories: 0
            };
            result.posts.published = await models.Post.count({
                where: { status: "publish", type: "post" }
            });

            result.posts.drafts = await models.Post.count({
                where: { status: "draft", type: "post" }
            });

            result.pages.published = await models.Post.count({
                where: { status: "publish", type: "page" }
            });

            result.pages.drafts = await models.Post.count({
                where: { status: "draft", type: "page" }
            });

            result.categories = await models.Taxonomy.count({
                where: { type: "post_category" }
            });
            result.tags = await models.Taxonomy.count({
                where: { type: "post_tag" }
            });

            return result;
        }
    },
    Mutation: {
        createPost: createPostsPerm.createResolver(
            (root, args, { models, user }) => {
                let data = {};
                Object.keys(args).forEach(field => {
                    data[field] = args[field];
                });
                data.author_id = user.id;
                return _createPost(data, models);
            }
        ),
        updatePost: editPostPerm.createResolver((root, args, { models }) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return _updatePost(data, models);
        }),
        uploadFile: editPostPerm.createResolver((root, args, { models }) => {
            return _updatePost(args, models);
        }),
        deletePosts: editPostPerm.createResolver(
            async (root, args, { models }) => {
                try {
                    const update = await models.Post.update(
                        { status: "trash" },
                        {
                            where: {
                                id: { in: args.ids.split(",") }
                            }
                        }
                    );
                    if (update) {
                        return {
                            ok: true
                        };
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        )
    },
    Post: {
        author: post => post.getAuthor(),
        taxonomies: post => {
            return post.getTaxonomies();
        }
    }
    // PostTaxonomy: {
    //     posts: async (taxonomy, { type, limit, offset }) => {
    //         const conditions = { where: { type, status: "publish" } };
    //         if (limit) {
    //             conditions.limit = limit;
    //         }
    //         if (offset) {
    //             conditions.offset = offset;
    //         }
    //         const result = {};
    //         result.posts = await taxonomy.getPosts(conditions);
    //         result.count = taxonomy.dataValues.posts.length;
    //         return result;
    //     }
    // }
};
