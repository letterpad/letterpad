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
        posts: checkDisplayAccess.createResolver((root, args, { models }) => {
            const newArgs = { ...args };

            if (newArgs.status == "all") delete newArgs.status;

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

            if (!menuItem) {
                return null;
            }
            const [id, type] = menuItem.id.split(/-(.+)/);

            return getTaxonomies(
                root,
                {
                    type: "post_category",
                    taxId: id,
                    postType: "post",
                    status: "publish"
                },
                { user, models }
            );
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
            (root, args, context) => {
                // const newArgs = { ...args };
                // const columns = Object.keys(context.models.Post.rawAttributes);
                // const conditions = getConditions(columns, newArgs);
                // if (newArgs.cursor) {
                //     conditions.where.id = { gt: newArgs.cursor };
                // }
                // console.log("===", args);
                // const taxId = await models.Taxonomy.findOne({where: {name}})
                return getTaxonomies(root, args, context);
            }
        ),
        taxonomyBySlug: checkDisplayAccess.createResolver(
            async (root, args, context) => {
                return getTaxonomies(root, args, context);
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
        createPost: createPostsPerm.createResolver((root, args, { models }) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });

            return _createPost(data, models);
        }),
        updatePost: editPostPerm.createResolver((root, args, { models }) => {
            let data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return _updatePost(data, models);
        }),
        uploadFile: editPostPerm.createResolver((root, args, { models }) => {
            return _updatePost(args, models);
        })
    },
    Post: {
        author: post => post.getAuthor(),
        taxonomies: post => {
            return post.getTaxonomies();
        }
    },
    PostTaxonomy: {
        posts: async (taxonomy, { type, limit, offset }) => {
            const conditions = { where: { type, status: "publish" } };
            if (limit) {
                conditions.limit = limit;
            }
            if (offset) {
                conditions.offset = offset;
            }
            return taxonomy.getPosts(conditions);
        },
        post_count: taxonomy => {
            return taxonomy.dataValues.posts.length;
        }
    }
};
