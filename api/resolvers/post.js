import Sequalize from "sequelize";
import { _createPost, _updatePost } from "../models";
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
            const columns = Object.keys(models.Post.rawAttributes);
            const conditions = getConditions(columns, args);
            if (args.status) {
                conditions.where.status = args.status;
            }
            return models.Post.count(conditions).then(count => {
                if (args.cursor) {
                    conditions.where.id = { gt: args.cursor };
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

            let item = menu.filter(item => item.slug == args.slug);

            const taxonomy = await models.Taxonomy.findOne({
                where: { id: item[0].id }
            });

            return getTaxonomies(
                root,
                {
                    type: "post_category",
                    name: taxonomy.dataValues.name,
                    postType: "post",
                    status: "publish"
                },
                { user, models }
            );
        },
        pageMenu: async (root, args) => {
            let that = this;
            let menu = await SettingsModel.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);
            let item = menu.reduce(item => item.slug == args.slug);
            args.status = "publish";
            if (!item) {
                return models.Post.findOne({
                    where: { type: "page", slug: args.slug }
                });
            }
            return models.Post.findOne({
                where: { id: item[0].id }
            });
        },
        adjacentPosts: async (root, args) => {
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
                return getTaxonomies(root, args, context);
            }
        )
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
            return _updatePost(data, { models });
        }),
        uploadFile: editPostPerm.createResolver((root, args, { models }) => {
            return _updatePost(args, models);
        })
    },
    Post: {
        author: post => post.getAuthors(),
        taxonomies: post => post.getTaxonomies()
    },
    PostTaxonomy: {
        posts: (taxonomy, { type }) => taxonomy.getPost({ where: { type } }),
        post_count: taxonomy => taxonomy.post[0].dataValues.post_count
    }
};
