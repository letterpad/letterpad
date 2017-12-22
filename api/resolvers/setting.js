import { SettingsModel, updateOptions } from "../models";
import { requiresAdmin } from "../utils/permissions";

export default {
    Query: {
        settings: (root, args) => {
            return SettingsModel.findAll({ where: args });
        }
    },
    Mutation: {
        updateOptions: requiresAdmin.createResolver((root, args) => {
            return updateOptions(args).then(() => {
                return SettingsModel.findAll();
            });
        })
    }
};
