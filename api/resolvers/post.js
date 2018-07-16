import { _createPost, _updatePost } from "../models/post";
import {
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
                obj["$or"] = {
                    body: query,
                    title: query
                };
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
        /**
         * Query to take care of multiple post in one page.
         * Used for Search and Admin posts and pages list.
         */
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
                conditions.order = [["id", "DESC"]];

                return models.Post.findAll(conditions).then(res => {
                    return {
                        count,
                        rows: res
                    };
                });
            });
        }),
        /**
         * Query to handle a single post/page.
         */
        post: checkDisplayAccess.createResolver((root, args, { models }) => {
            return models.Post.findOne({ where: args });
        }),
        /**
         * Query to take care of posts from navigation menu.
         * The navigation menu item will be a category with its own custom slug.
         *
         * First we get the menu object and loop though it to
         * find the item (by matching slug) which was clicked.
         * Note: The menu can have nested children.
         *
         * Now we know the id of the category. Using this id, we will find all the linked posts.
         */
        postsMenu: async (root, args, { models, user }) => {
            let menu = await models.Setting.findOne({
                where: { option: "menu" }
            });

            menu = JSON.parse(menu.dataValues.value);

            let menuItem = null;
            let catId = null;

            const setItemFromMenu = (arr, slug) => {
                const a = arr.some(item => {
                    if (item.slug && item.slug == slug) {
                        menuItem = item;
                    }
                    if (item.children && item.children.length > 0) {
                        setItemFromMenu(item.children, slug);
                    }
                });
            };
            setItemFromMenu(menu, args.slug);

            if (!menuItem) {
                const taxonomy = await models.Taxonomy.findOne({
                    where: { slug: args.slug, type: args.type }
                });
                if (taxonomy) {
                    catId = taxonomy.dataValues.id;
                } else {
                    return {
                        count: 0,
                        posts: []
                    };
                }
            } else {
                catId = menuItem.id;
            }

            const conditions = {
                where: {
                    type: args.postType,
                    status: "publish"
                },
                include: [
                    {
                        model: models.PostTaxonomy,
                        where: { taxonomy_id: catId },
                        require: true
                    }
                ],
                order: [["id", "DESC"]]
            };

            if ("limit" in args) {
                conditions.limit = args.limit;
            }
            if ("offset" in args) {
                conditions.offset = args.offset;
            }

            let data = await models.Post.findAndCountAll(conditions);

            return {
                count: data.count,
                posts: data.rows
            };
        },
        /**
         * Query to take care of page clicked from nav menu.
         * As pages cannot have a custom slug, we can directly query the Post table
         * with the given slug.
         *
         */
        pageMenu: async (root, args, { models }) => {
            const response = {
                ok: true,
                post: null,
                errors: []
            };
            const page = await models.Post.findOne({
                where: { type: "page", slug: args.slug, status: "publish" }
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
        },
        /**
         * Query to take care of adjacent posts.
         */
        adjacentPosts: async (root, args, { models }) => {
            let result = {};
            args.status = "publish";
            // get the current post
            const currentPost = await models.Post.findOne({ where: args });
            if (currentPost === null) {
                throw new Error("Invalid query");
            }

            // we dont need the slug anymore. Clone and remove it.
            const newArgs = { ...args };
            delete newArgs.slug;

            // get the preview item
            result.previous = await models.Post.findOne({
                where: {
                    ...newArgs,
                    id: { $lt: currentPost.dataValues.id }
                },
                order: [["id", "DESC"]],
                limit: 1
            });

            // get the next item
            result.next = await models.Post.findOne({
                where: {
                    ...newArgs,
                    id: {
                        $gt: currentPost.dataValues.id
                    }
                },
                order: [["id", "ASC"]],
                limit: 1
            });

            return result;
        },
        /**
         * Query to get posts by taxonomy slug and taxonomy type.
         * The type can be post_category or post_tag
         */
        postsByTaxSlug: checkDisplayAccess.createResolver(
            async (root, args, { models }) => {
                // Get the taxonomy item
                const taxonomy = await models.Taxonomy.findOne({
                    where: { slug: args.slug, type: args.type }
                });

                if (taxonomy) {
                    const taxId = taxonomy.dataValues.id;
                    const conditions = {
                        where: {
                            status: "publish"
                        },
                        include: [
                            {
                                model: models.PostTaxonomy,
                                where: { taxonomy_id: taxId },
                                require: true
                            }
                        ],
                        order: [["id", "DESC"]]
                    };
                    if ("postType" in args) {
                        conditions.where.type = args.postType;
                    }
                    if ("limit" in args) {
                        conditions.limit = args.limit;
                    }
                    if ("offset" in args) {
                        conditions.offset = args.offset;
                    }

                    let data = await models.Post.findAndCountAll(conditions);
                    return {
                        count: data.count,
                        posts: data.rows
                    };
                } else {
                    return {
                        count: 0,
                        posts: []
                    };
                }
            }
        ),
        /**
         * Query to get some stats for the admin dashboard
         * TODO: Make one query to process all the data
         */
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
                data.body = "";
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
                    // check the status of one post. If its already in trash
                    // then permanently delete it
                    const randomPost = await models.Post.findOne({
                        where: { id: args.ids.split(",")[0] }
                    });
                    if (randomPost.status == "trash") {
                        await models.Post.destroy({
                            where: { id: { in: args.ids.split(",") } }
                        });
                    } else {
                        await models.Post.update(
                            { status: "trash" },
                            {
                                where: {
                                    id: { in: args.ids.split(",") }
                                }
                            }
                        );
                    }
                    return {
                        ok: true
                    };
                } catch (e) {
                    return {
                        ok: false,
                        errors: [
                            {
                                message: e.message,
                                path: "deleteMessage"
                            }
                        ]
                    };
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
};
