import { requiresAdmin } from "../utils/permissions";

export default {
    Query: {
        settings: (root, args, { models }) => {
            return models.Setting.findAll({ where: args });
        }
    },
    Mutation: {
        updateOptions: requiresAdmin.createResolver(
            async (root, args, { models }) => {
                let promises = args.options.map(setting => {
                    if (setting.option === "css") {
                        require("fs").writeFileSync(
                            require("path").join(
                                __dirname,
                                "../../public/css/custom.css"
                            ),
                            setting.value
                        );
                    }
                    return models.Setting.update(setting, {
                        where: { option: setting.option }
                    });
                });
                await Promise.all(promises);
                return models.Setting.findAll();
            }
        )
    }
};
