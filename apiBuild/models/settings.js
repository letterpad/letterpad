"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createOptions = createOptions;
exports.updateOptions = updateOptions;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isArray(obj) {
    return !!obj && obj.constructor === Array;
}

exports.default = function (conn, DataTypes) {
    var Setting = conn.define("settings", {
        option: {
            type: _sequelize2.default.STRING
        },
        value: {
            type: _sequelize2.default.TEXT
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    return Setting;
};

function createOptions(data) {
    if (!isArray(data)) {
        data = [data];
    }
    return SettingsModel.bulkCreate(data).then(function () {
        return SettingsModel.findAll();
    });
}

function updateOptions(data) {
    var promises = data.options.map(function (setting) {
        return SettingsModel.update(setting, {
            where: { option: setting.option }
        });
    });
    return Promise.all(promises);
}