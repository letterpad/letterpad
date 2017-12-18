import { SettingsModel, updateOptions } from "../models";

export default {
    Query: {
        settings: (root, args) => {
            return SettingsModel.findAll({ where: args });
        }
    },
    Mutation: {
        updateOptions: (root, args) => {
            return updateOptions(args).then(() => {
                return SettingsModel.findAll();
            });
        }
    }
};
