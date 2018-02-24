import { UnauthorizedError } from "../utils/common";
import { editPostPerm } from "../utils/permissions";

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
        media: async (root, args, { user, models }) => {
            if (!user || !user.id) {
                throw new UnauthorizedError({ url: "/media" });
            }
            const columns = Object.keys(models.Post.rawAttributes);
            const conditions = getConditions(columns, args);

            const count = await models.Media.count(conditions);
            if (args.cursor) {
                conditions.where.id = { gt: args.cursor };
            }
            const media = await models.Media.findAll(conditions);
            return {
                count,
                rows: media
            };
        }
    },
    Mutation: {
        insertMedia: editPostPerm.createResolver((root, args, { models }) => {
            const data = {};
            Object.keys(args).forEach(field => {
                data[field] = args[field];
            });
            return models.Media.create(data);
        }),

        deleteMedia: editPostPerm.createResolver(
            async (root, args, { models }) => {
                let destroyedRecord = await models.Media.destroy({
                    where: { id: args.id }
                });
                if (destroyedRecord == 1) {
                    return {
                        ok: true,
                        id: args.id
                    };
                }
                return { ok: false };
            }
        )
    }
};
