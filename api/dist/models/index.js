"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaModel = exports.updateOptions = exports.SettingsModel = exports.uploadFile = exports.PostTaxonomyModel = exports.RoleAuthorModel = exports.RolePermissionModel = exports.PermissionModel = exports.RoleModel = exports.AuthorModel = exports.TaxonomyModel = exports._updatePost = exports._createPost = exports.PostModel = undefined;

var _post = require("./post");

Object.defineProperty(exports, "PostModel", {
    enumerable: true,
    get: function get() {
        return _post.PostModel;
    }
});
Object.defineProperty(exports, "_createPost", {
    enumerable: true,
    get: function get() {
        return _post._createPost;
    }
});
Object.defineProperty(exports, "_updatePost", {
    enumerable: true,
    get: function get() {
        return _post._updatePost;
    }
});

var _taxonomy = require("./taxonomy");

Object.defineProperty(exports, "TaxonomyModel", {
    enumerable: true,
    get: function get() {
        return _taxonomy.TaxonomyModel;
    }
});

var _author = require("./author");

Object.defineProperty(exports, "AuthorModel", {
    enumerable: true,
    get: function get() {
        return _author.AuthorModel;
    }
});

var _role = require("./role");

Object.defineProperty(exports, "RoleModel", {
    enumerable: true,
    get: function get() {
        return _role.RoleModel;
    }
});

var _permission = require("./permission");

Object.defineProperty(exports, "PermissionModel", {
    enumerable: true,
    get: function get() {
        return _permission.PermissionModel;
    }
});

var _rolePermission = require("./rolePermission");

Object.defineProperty(exports, "RolePermissionModel", {
    enumerable: true,
    get: function get() {
        return _rolePermission.RolePermissionModel;
    }
});

var _roleAuthor = require("./roleAuthor");

Object.defineProperty(exports, "RoleAuthorModel", {
    enumerable: true,
    get: function get() {
        return _roleAuthor.RoleAuthorModel;
    }
});

var _postTaxonomy = require("./postTaxonomy");

Object.defineProperty(exports, "PostTaxonomyModel", {
    enumerable: true,
    get: function get() {
        return _postTaxonomy.PostTaxonomyModel;
    }
});

var _upload = require("./upload");

Object.defineProperty(exports, "uploadFile", {
    enumerable: true,
    get: function get() {
        return _upload.uploadFile;
    }
});

var _settings = require("./settings");

Object.defineProperty(exports, "SettingsModel", {
    enumerable: true,
    get: function get() {
        return _settings.SettingsModel;
    }
});
Object.defineProperty(exports, "updateOptions", {
    enumerable: true,
    get: function get() {
        return _settings.updateOptions;
    }
});

var _media = require("./media");

Object.defineProperty(exports, "MediaModel", {
    enumerable: true,
    get: function get() {
        return _media.MediaModel;
    }
});

var _taxonomy2 = _interopRequireDefault(_taxonomy);

var _post2 = _interopRequireDefault(_post);

var _role2 = _interopRequireDefault(_role);

var _permission2 = _interopRequireDefault(_permission);

var _author2 = _interopRequireDefault(_author);

var _media2 = _interopRequireDefault(_media);

var _postTaxonomy2 = _interopRequireDefault(_postTaxonomy);

var _rolePermission2 = _interopRequireDefault(_rolePermission);

var _roleAuthor2 = _interopRequireDefault(_roleAuthor);

var _db = require("../../config/db.config");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_post2.default.belongsToMany(_taxonomy2.default, {
    through: _postTaxonomy2.default,
    as: "taxonomy"
});

_taxonomy2.default.belongsToMany(_post2.default, {
    through: _postTaxonomy2.default,
    as: "post"
});

_author2.default.hasMany(_post2.default);
_post2.default.belongsTo(_author2.default);

_role2.default.belongsToMany(_permission2.default, {
    through: _rolePermission2.default,
    as: "permission"
});

_permission2.default.belongsToMany(_role2.default, {
    through: _rolePermission2.default,
    as: "role"
});

// RoleModel.belongsToMany(AuthorModel, {
//     through: RoleAuthorModel,
//     as: "author"
// });
_role2.default.hasMany(_author2.default);

_author2.default.belongsTo(_role2.default);

_db2.default.sync({ force: false });