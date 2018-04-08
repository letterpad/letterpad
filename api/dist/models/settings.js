"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createOptions = createOptions;
exports.updateOptions = updateOptions;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

function isArray(obj) {
    return !!obj && obj.constructor === Array;
}

var _default = function _default(conn, DataTypes) {
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

exports.default = _default;
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
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(isArray, "isArray", "api/models/settings.js");
    reactHotLoader.register(createOptions, "createOptions", "api/models/settings.js");
    reactHotLoader.register(updateOptions, "updateOptions", "api/models/settings.js");
    reactHotLoader.register(_default, "default", "api/models/settings.js");
    leaveModule(module);
})();

;