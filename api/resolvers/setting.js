import { updateOptions } from "../models";
import { requiresAdmin } from "../utils/permissions";

export default {
    Query: {
        settings: (root, args, { models }) => {
            return models.Setting.findAll({ where: args });
        }
    },
    Mutation: {
        updateOptions: requiresAdmin.createResolver(
            (root, args, { models }) => {
                return updateOptions(args, { models }).then(() => {
                    return models.Setting.findAll();
                });
            }
        )
    }
};
