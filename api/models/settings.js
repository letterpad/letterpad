import Sequalize from "sequelize";

function isArray(obj) {
    return !!obj && obj.constructor === Array;
}

export default (conn, DataTypes) => {
    const Setting = conn.define(
        "settings",
        {
            option: {
                type: Sequalize.STRING
            },
            value: {
                type: Sequalize.TEXT
            }
        },
        {
            freezeTableName: true // Model tableName will be the same as the model name
        }
    );
    return Setting;
};

export function createOptions(data) {
    if (!isArray(data)) {
        data = [data];
    }
    return SettingsModel.bulkCreate(data).then(() => {
        return SettingsModel.findAll();
    });
}

export function updateOptions(data) {
    let promises = data.options.map(setting => {
        return SettingsModel.update(setting, {
            where: { option: setting.option }
        });
    });
    return Promise.all(promises);
}
