"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPermissions = undefined;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = function _default(conn, Datatypes) {
    var Author = conn.define("author", {
        username: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        password: {
            type: _sequelize2.default.STRING,
            allowNull: false
        },
        email: {
            type: _sequelize2.default.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Email not valid"
                }
            }
        },
        social: {
            type: _sequelize2.default.STRING,
            defaultValue: "{}"
        },
        fname: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        lname: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        token: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        avatar: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        }
    }, {
        freezeTableName: true
    });
    Author.associate = function (models) {
        // 1:n
        Author.hasMany(models.Post);
        //  1:1
        Author.belongsTo(models.Role);
        Author.hasMany(models.Media);
    };
    return Author;
};

exports.default = _default;
var getPermissions = exports.getPermissions = async function getPermissions(models, role_id) {
    var permissions = await models.Permission.findAll({
        attributes: ["name"],
        through: { attributes: [] },
        include: [{
            model: models.Role,
            attributes: [],
            as: models.Role.tableName,
            where: {
                id: role_id
            }
        }]
    });
    return permissions.map(function (per) {
        return per.name;
    });
};
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(getPermissions, "getPermissions", "api/models/author.js");
    reactHotLoader.register(_default, "default", "api/models/author.js");
    leaveModule(module);
})();

;