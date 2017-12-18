import { MediaModel, PostModel } from "../models";

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
        }
    },
    Mutation: {
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
    }
};
