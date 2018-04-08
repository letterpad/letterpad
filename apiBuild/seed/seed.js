"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.insertSettings = exports.insertMedia = exports.insertPost = exports.insertTaxonomy = exports.insertAuthor = exports.insertRolePermData = exports.seed = undefined;

var insertRolePermData = exports.insertRolePermData = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var MANAGE_OWN_POSTS, READ_ONLY_POSTS, MANAGE_ALL_POSTS, MANAGE_USERS, MANAGE_SETTINGS, role;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return models.Permission.create({
                            name: "MANAGE_OWN_POSTS"
                        });

                    case 2:
                        MANAGE_OWN_POSTS = _context2.sent;
                        _context2.next = 5;
                        return models.Permission.create({
                            name: "READ_ONLY_POSTS"
                        });

                    case 5:
                        READ_ONLY_POSTS = _context2.sent;
                        _context2.next = 8;
                        return models.Permission.create({
                            name: "MANAGE_ALL_POSTS"
                        });

                    case 8:
                        MANAGE_ALL_POSTS = _context2.sent;
                        _context2.next = 11;
                        return models.Permission.create({
                            name: "MANAGE_USERS"
                        });

                    case 11:
                        MANAGE_USERS = _context2.sent;
                        _context2.next = 14;
                        return models.Permission.create({
                            name: "MANAGE_SETTINGS"
                        });

                    case 14:
                        MANAGE_SETTINGS = _context2.sent;
                        _context2.next = 17;
                        return models.Role.create({ name: "ADMIN" });

                    case 17:
                        role = _context2.sent;
                        _context2.next = 20;
                        return role.addPermission(MANAGE_OWN_POSTS);

                    case 20:
                        _context2.next = 22;
                        return role.addPermission(READ_ONLY_POSTS);

                    case 22:
                        _context2.next = 24;
                        return role.addPermission(MANAGE_ALL_POSTS);

                    case 24:
                        _context2.next = 26;
                        return role.addPermission(MANAGE_USERS);

                    case 26:
                        _context2.next = 28;
                        return role.addPermission(MANAGE_SETTINGS);

                    case 28:
                        _context2.next = 30;
                        return models.Role.create({ name: "REVIEWER" });

                    case 30:
                        role = _context2.sent;
                        _context2.next = 33;
                        return role.addPermission(MANAGE_ALL_POSTS);

                    case 33:
                        _context2.next = 35;
                        return models.Role.create({ name: "READER" });

                    case 35:
                        role = _context2.sent;
                        _context2.next = 38;
                        return role.addPermission(READ_ONLY_POSTS);

                    case 38:
                        _context2.next = 40;
                        return models.Role.create({ name: "AUTHOR" });

                    case 40:
                        role = _context2.sent;
                        _context2.next = 43;
                        return role.addPermission(MANAGE_OWN_POSTS);

                    case 43:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function insertRolePermData() {
        return _ref2.apply(this, arguments);
    };
}();

var insertAuthor = exports.insertAuthor = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return models.Author.bulkCreate([{
                            fname: "John",
                            lname: "Dave",
                            email: "admin@razor.com",
                            password: _bcryptjs2.default.hashSync("password", 12),
                            social: JSON.stringify({
                                twitter: "",
                                facebook: "",
                                github: "",
                                instagram: ""
                            }),
                            role_id: 1
                        }, {
                            fname: "Jim",
                            lname: "Parker",
                            email: "author@razor.com",
                            password: _bcryptjs2.default.hashSync("password", 12),
                            social: JSON.stringify({
                                twitter: "",
                                facebook: "",
                                github: "",
                                instagram: ""
                            }),
                            role_id: 1
                        }]);

                    case 2:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function insertAuthor() {
        return _ref3.apply(this, arguments);
    };
}();

var insertTaxonomy = exports.insertTaxonomy = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return models.Taxonomy.bulkCreate([{
                            name: "Uncategorized",
                            type: "post_category",
                            slug: "un-categorized"
                        }, {
                            name: "General",
                            type: "post_category",
                            slug: "gen"
                        }]);

                    case 2:
                        _context4.next = 4;
                        return models.Taxonomy.bulkCreate([{
                            name: "tag1",
                            type: "post_tag",
                            slug: "tag-1"
                        }, {
                            name: "tag2",
                            type: "post_tag",
                            slug: "tag-2"
                        }, {
                            name: "tag3",
                            type: "post_tag",
                            slug: "tag-3"
                        }, {
                            name: "tag4",
                            type: "post_tag",
                            slug: "tag-4"
                        }, {
                            name: "tag5",
                            type: "post_tag",
                            slug: "tag-5"
                        }]);

                    case 4:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function insertTaxonomy() {
        return _ref4.apply(this, arguments);
    };
}();

var insertPost = exports.insertPost = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(params) {
        var admin, title, slug, imageNo, post, taxonomy, postItem;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return models.Author.findOne({ where: { role_id: 1 } });

                    case 2:
                        admin = _context5.sent;
                        title = _faker2.default.lorem.words(3);
                        slug = title.toLocaleLowerCase().replace(/ /g, "-");
                        imageNo = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
                        _context5.next = 8;
                        return models.Post.create(_defineProperty({
                            title: params.title,
                            body: _faker2.default.lorem.paragraphs(6),
                            excerpt: _faker2.default.lorem.sentences(),
                            cover_image: "/uploads/" + imageNo + ".jpeg",
                            author_id: 1,
                            type: params.type,
                            status: params.status,
                            slug: slug
                        }, "author_id", admin.id));

                    case 8:
                        post = _context5.sent;
                        _context5.next = 11;
                        return admin.addPost(post);

                    case 11:
                        _context5.next = 13;
                        return models.Taxonomy.findOne({
                            where: { type: "post_category" }
                        });

                    case 13:
                        taxonomy = _context5.sent;
                        _context5.next = 16;
                        return models.Post.findOne({
                            limit: 1,
                            order: [["id", "DESC"]]
                        });

                    case 16:
                        postItem = _context5.sent;
                        _context5.next = 19;
                        return postItem.addTaxonomy(taxonomy);

                    case 19:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function insertPost(_x) {
        return _ref5.apply(this, arguments);
    };
}();

var insertMedia = exports.insertMedia = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(params) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return models.Media.bulkCreate([{ url: "/uploads/1.jpeg", author_id: 1 }, { url: "/uploads/2.jpeg", author_id: 1 }, { url: "/uploads/3.jpeg", author_id: 1 }, { url: "/uploads/4.jpeg", author_id: 1 }, { url: "/uploads/5.jpeg", author_id: 1 }, { url: "/uploads/6.jpeg", author_id: 1 }, { url: "/uploads/7.jpeg", author_id: 1 }, { url: "/uploads/8.jpeg", author_id: 1 }, { url: "/uploads/9.jpeg", author_id: 1 }, { url: "/uploads/10.jpeg", author_id: 1 }]);

                    case 2:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function insertMedia(_x2) {
        return _ref6.apply(this, arguments);
    };
}();

var insertSettings = exports.insertSettings = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var menu, data;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        menu = JSON.stringify([{
                            id: "1",
                            label: "Uncategorized",
                            type: "category",
                            name: "Home",
                            children: [],
                            slug: "custom-slug"
                        }, {
                            id: "2",
                            label: "General",
                            type: "category",
                            name: "Empty",
                            children: [],
                            slug: "gen"
                        }, {
                            id: "12",
                            label: "Page 2",
                            slug: "error-quasi-iste",
                            type: "page",
                            name: "About Me",
                            children: []
                        }, {
                            id: "1519412227282-label",
                            label: "Label",
                            type: "label",
                            name: "Folder",
                            children: [{
                                id: "1519412236064-label",
                                label: "Label",
                                type: "label",
                                name: "Sub Folder",
                                children: [{
                                    id: "11-page",
                                    label: "Page 1",
                                    slug: "dignissimos-est-consequatur",
                                    type: "page",
                                    name: "Page 1",
                                    disabled: true,
                                    children: []
                                }]
                            }]
                        }]);
                        data = [{
                            option: "site_title",
                            value: "Letterpad"
                        }, {
                            option: "site_tagline",
                            value: "Compose a story"
                        }, {
                            option: "site_email",
                            value: ""
                        }, {
                            option: "site_url",
                            value: ""
                        }, {
                            option: "site_footer",
                            value: ""
                        }, {
                            option: "site_description",
                            value: ""
                        }, {
                            option: "post_display",
                            value: "row"
                        }, {
                            option: "layout_display",
                            value: "two-column"
                        }, {
                            option: "social_twitter",
                            value: ""
                        }, {
                            option: "social_facebook",
                            value: ""
                        }, {
                            option: "social_instagram",
                            value: ""
                        }, {
                            option: "text_notfound",
                            value: "Sorry, we went deep inside, but found nothing"
                        }, {
                            option: "text_posts_empty",
                            value: "Sorry, we couldn't find any posts"
                        }, {
                            option: "sidebar_latest_post_count",
                            value: 3
                        }, {
                            option: "sidebar_about",
                            value: "You can fill up this space by writing a short bio about yourself or about your site.."
                        }, {
                            option: "menu",
                            value: menu
                        }, {
                            option: "css",
                            value: ""
                        }, {
                            option: "colors",
                            value: JSON.stringify({
                                "--color-text-primary": "#373737",
                                "--color-text-primary-invert": " #b7b7b7",
                                "--color-text-primary-light": " #616161",
                                "--color-text-muted": " #b9b9b9",
                                "--color-text-secondary": " #000000",
                                "--color-text-secondary-light": " #4c4c4c",
                                "--color-accent": "#4486ea",
                                "--color-bg-primary": "#373636",
                                "--color-bg-secondary": " #1f1e1e",
                                "--color-border": " #e5e5e5",
                                "--link-hover": " #1a82d6",
                                "--color-menu-link": "  #b7b7b7"
                            })
                        }, {
                            option: "locale",
                            value: JSON.stringify({ en: true, fr: false, pl: false })
                        }, {
                            option: "theme",
                            value: "amun"
                        }, {
                            option: "banner",
                            value: ""
                        }];
                        _context7.next = 4;
                        return models.Setting.bulkCreate(data);

                    case 4:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function insertSettings() {
        return _ref7.apply(this, arguments);
    };
}();

var _db = require("../../config/db.config");

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _faker = require("faker");

var _faker2 = _interopRequireDefault(_faker);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("dotenv").config({ path: "../../.env" });

var copydir = require("copy-dir");
_faker2.default.locale = "en_US";
var models = {
    Author: _db.conn.import("../models/author"),
    Post: _db.conn.import("../models/post"),
    Taxonomy: _db.conn.import("../models/taxonomy"),
    Role: _db.conn.import("../models/role"),
    Permission: _db.conn.import("../models/permission"),
    Setting: _db.conn.import("../models/settings"),
    Media: _db.conn.import("../models/media")
};

Object.keys(models).map(function (name) {
    if ("associate" in models[name]) {
        models[name].associate(models);
    }
});
models.Sequalize = _sequelize2.default;
models.conn = _db.conn;

var seed = exports.seed = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return models.conn.sync({ force: true });

                    case 2:

                        // do some clean first. delete the uploads folder
                        (0, _rimraf2.default)(__dirname + "/../../public/uploads/*", function () {
                            copydir.sync(__dirname + "/uploads", __dirname + "/../../public/uploads");
                        });
                        _context.next = 5;
                        return insertRolePermData();

                    case 5:
                        _context.next = 7;
                        return insertAuthor();

                    case 7:
                        _context.next = 9;
                        return insertTaxonomy();

                    case 9:
                        _context.next = 11;
                        return insertPost({ title: "Post 1", type: "post", status: "publish" });

                    case 11:
                        _context.next = 13;
                        return insertPost({ title: "Post 2", type: "post", status: "publish" });

                    case 13:
                        _context.next = 15;
                        return insertPost({ title: "Post 3", type: "post", status: "publish" });

                    case 15:
                        _context.next = 17;
                        return insertPost({ title: "Post 4", type: "post", status: "publish" });

                    case 17:
                        _context.next = 19;
                        return insertPost({ title: "Post 5", type: "post", status: "publish" });

                    case 19:
                        _context.next = 21;
                        return insertPost({ title: "Post 6", type: "post", status: "publish" });

                    case 21:
                        _context.next = 23;
                        return insertPost({ title: "Post 7", type: "post", status: "publish" });

                    case 23:
                        _context.next = 25;
                        return insertPost({ title: "Post 8", type: "post", status: "publish" });

                    case 25:
                        _context.next = 27;
                        return insertPost({ title: "Post 9", type: "post", status: "publish" });

                    case 27:
                        _context.next = 29;
                        return insertPost({ title: "Post 10", type: "post", status: "publish" });

                    case 29:
                        _context.next = 31;
                        return insertPost({ title: "Post 11", type: "post", status: "publish" });

                    case 31:
                        _context.next = 33;
                        return insertPost({ title: "Post 12", type: "post", status: "publish" });

                    case 33:
                        _context.next = 35;
                        return insertPost({ title: "Post 13", type: "post", status: "publish" });

                    case 35:
                        _context.next = 37;
                        return insertPost({ title: "Post 14", type: "post", status: "publish" });

                    case 37:
                        _context.next = 39;
                        return insertPost({ title: "Post 15", type: "post", status: "publish" });

                    case 39:
                        _context.next = 41;
                        return insertPost({ title: "Post 16", type: "post", status: "publish" });

                    case 41:
                        _context.next = 43;
                        return insertPost({ title: "Post 17", type: "post", status: "publish" });

                    case 43:
                        _context.next = 45;
                        return insertPost({ title: "Post 18", type: "post", status: "publish" });

                    case 45:
                        _context.next = 47;
                        return insertPost({ title: "Post 19", type: "post", status: "publish" });

                    case 47:
                        _context.next = 49;
                        return insertPost({ title: "Post 20", type: "post", status: "publish" });

                    case 49:
                        _context.next = 51;
                        return insertPost({ title: "Post 21", type: "post", status: "publish" });

                    case 51:
                        _context.next = 53;
                        return insertPost({ title: "Post 22", type: "post", status: "publish" });

                    case 53:
                        _context.next = 55;
                        return insertPost({ title: "Post 23", type: "post", status: "publish" });

                    case 55:
                        _context.next = 57;
                        return insertPost({ title: "Post 24", type: "post", status: "publish" });

                    case 57:
                        _context.next = 59;
                        return insertPost({ title: "Post 25", type: "post", status: "publish" });

                    case 59:
                        _context.next = 61;
                        return insertPost({ title: "Post 26", type: "post", status: "publish" });

                    case 61:
                        _context.next = 63;
                        return insertPost({ title: "Post 27", type: "post", status: "publish" });

                    case 63:
                        _context.next = 65;
                        return insertPost({ title: "Post 28", type: "post", status: "publish" });

                    case 65:
                        _context.next = 67;
                        return insertPost({ title: "Post 29", type: "post", status: "publish" });

                    case 67:
                        _context.next = 69;
                        return insertPost({ title: "Post 30", type: "post", status: "publish" });

                    case 69:
                        _context.next = 71;
                        return insertPost({ title: "Post 31", type: "post", status: "publish" });

                    case 71:
                        _context.next = 73;
                        return insertPost({ title: "Post 32", type: "post", status: "publish" });

                    case 73:
                        _context.next = 75;
                        return insertPost({ title: "Post 33", type: "post", status: "publish" });

                    case 75:
                        _context.next = 77;
                        return insertPost({ title: "Post 34", type: "post", status: "publish" });

                    case 77:
                        _context.next = 79;
                        return insertPost({ title: "Post 35", type: "post", status: "publish" });

                    case 79:
                        _context.next = 81;
                        return insertPost({ title: "Post 36", type: "post", status: "publish" });

                    case 81:
                        _context.next = 83;
                        return insertPost({ title: "Post 37", type: "post", status: "publish" });

                    case 83:
                        _context.next = 85;
                        return insertPost({ title: "Post 38", type: "post", status: "publish" });

                    case 85:
                        _context.next = 87;
                        return insertPost({ title: "Post 39", type: "post", status: "publish" });

                    case 87:
                        _context.next = 89;
                        return insertPost({ title: "Post 40", type: "post", status: "publish" });

                    case 89:
                        _context.next = 91;
                        return insertPost({ title: "Post 41", type: "post", status: "publish" });

                    case 91:
                        _context.next = 93;
                        return insertPost({ title: "Post 42", type: "post", status: "publish" });

                    case 93:
                        _context.next = 95;
                        return insertPost({ title: "Post 43", type: "post", status: "publish" });

                    case 95:
                        _context.next = 97;
                        return insertPost({ title: "Post 44", type: "post", status: "publish" });

                    case 97:
                        _context.next = 99;
                        return insertPost({ title: "Post 45", type: "post", status: "publish" });

                    case 99:
                        _context.next = 101;
                        return insertPost({ title: "Post 46", type: "post", status: "publish" });

                    case 101:
                        _context.next = 103;
                        return insertPost({ title: "Post 9-draft", type: "post", status: "draft" });

                    case 103:
                        _context.next = 105;
                        return insertPost({ title: "Post 10-draft", type: "post", status: "draft" });

                    case 105:
                        _context.next = 107;
                        return insertPost({ title: "Page 1", type: "page", status: "publish" });

                    case 107:
                        _context.next = 109;
                        return insertPost({ title: "Page 2", type: "page", status: "publish" });

                    case 109:
                        _context.next = 111;
                        return insertPost({
                            title: "Page 3 (draft)",
                            type: "page",
                            status: "draft"
                        });

                    case 111:
                        _context.next = 113;
                        return insertSettings();

                    case 113:
                        _context.next = 115;
                        return insertMedia();

                    case 115:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function seed() {
        return _ref.apply(this, arguments);
    };
}();

if (require.main === module) {
    seed();
}