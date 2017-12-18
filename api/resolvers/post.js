import Sequalize from "sequelize";
import {
    _createPost,
    _updatePost,
    MediaModel,
    PostModel,
    SettingsModel,
    TaxonomyModel
} from "../models";
import { getTaxonomies } from "../models/taxonomy";

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
                conditions.order = [["id", "DESC"]];
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
        postsMenu: async (root, args) => {
            let that = this;
            let menu = await SettingsModel.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);

            let item = menu.filter(item => item.slug == args.slug);

            const taxonomy = await TaxonomyModel.findOne({
                where: { id: item[0].id }
            });

            return getTaxonomies({
                type: "post_category",
                name: taxonomy.dataValues.name,
                postType: "post"
            });
        },
        pageMenu: async (root, args) => {
            let that = this;
            let menu = await SettingsModel.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);
            let item = menu.reduce(item => item.slug == args.slug);
            console.log(item);
            if (!item) {
                return PostModel.findOne({
                    where: { type: "page", slug: args.slug }
                });
            }
            return PostModel.findOne({
                where: { id: item[0].id }
            });
        },
        adjacentPosts: async (root, args) => {
            let data = {
                previous: {},
                next: {}
            };
            const postCheck = await PostModel.findOne({ where: args });
            if (postCheck === null) {
                throw new Error("Invalid query");
            }
            const prevPost = await PostModel.findOne({
                where: {
                    id: { $lt: postCheck.dataValues.id },
                    type: args.type
                },
                order: [["id", "DESC"]],
                limit: 1
            });
            data.previous = prevPost;
            const nextPost = await PostModel.findOne({
                where: {
                    id: {
                        $gt: postId
                    },
                    type: args.type
                },
                order: [["id", "ASC"]],
                limit: 1
            });
            data.next = nextPost;
            return data;
        },
        postTaxonomies: (root, args) => {
            return getTaxonomies(args);
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
