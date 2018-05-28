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
                        return role.addPermission(READ_ONLY_POSTS);

                    case 20:
                        _context2.next = 22;
                        return role.addPermission(MANAGE_ALL_POSTS);

                    case 22:
                        _context2.next = 24;
                        return role.addPermission(MANAGE_USERS);

                    case 24:
                        _context2.next = 26;
                        return role.addPermission(MANAGE_SETTINGS);

                    case 26:
                        _context2.next = 28;
                        return models.Role.create({ name: "REVIEWER" });

                    case 28:
                        role = _context2.sent;
                        _context2.next = 31;
                        return role.addPermission(MANAGE_ALL_POSTS);

                    case 31:
                        _context2.next = 33;
                        return models.Role.create({ name: "READER" });

                    case 33:
                        role = _context2.sent;
                        _context2.next = 36;
                        return role.addPermission(READ_ONLY_POSTS);

                    case 36:
                        _context2.next = 38;
                        return models.Role.create({ name: "AUTHOR" });

                    case 38:
                        role = _context2.sent;
                        _context2.next = 41;
                        return role.addPermission(MANAGE_OWN_POSTS);

                    case 41:
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
                            email: "demo@demo.com",
                            password: _bcryptjs2.default.hashSync("demo", 12),
                            social: JSON.stringify({
                                twitter: "https://twitter.com",
                                facebook: "https://facebook.com",
                                github: "https://github.com",
                                instagram: "https://instagram.com"
                            }),
                            role_id: 1,
                            bio: "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
                            avatar: "/admin/images/avatar.png"
                        }, {
                            fname: "Jim",
                            lname: "Parker",
                            email: "author@letterpad.app",
                            password: _bcryptjs2.default.hashSync("demo", 12),
                            social: JSON.stringify({
                                twitter: "https://twitter.com",
                                facebook: "https://facebook.com",
                                github: "https://github.com",
                                instagram: "https://instagram.com"
                            }),
                            role_id: 1,
                            bio: "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
                            avatar: "/admin/images/avatar.png"
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
                            name: "Travel",
                            type: "post_category",
                            slug: "travel"
                        }, {
                            name: "Nature",
                            type: "post_category",
                            slug: "nature"
                        }, {
                            name: "Abstract",
                            type: "post_category",
                            slug: "abstract"
                        }]);

                    case 2:
                        _context4.next = 4;
                        return models.Taxonomy.bulkCreate([{
                            name: "sports",
                            type: "post_tag",
                            slug: "sports"
                        }, {
                            name: "nature",
                            type: "post_tag",
                            slug: "nature"
                        }, {
                            name: "street",
                            type: "post_tag",
                            slug: "street"
                        }, {
                            name: "forest",
                            type: "post_tag",
                            slug: "forest"
                        }, {
                            name: "sky",
                            type: "post_tag",
                            slug: "sky"
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
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(params) {
        var _this = this;

        var randomAuthorId, admin, slug, post, categories, tags, postItem, randomCategory;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        // get author  // 1 or 2
                        randomAuthorId = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                        _context6.next = 3;
                        return models.Author.findOne({ where: { id: randomAuthorId } });

                    case 3:
                        admin = _context6.sent;
                        slug = params.title.toLocaleLowerCase().replace(/ /g, "-");
                        _context6.next = 7;
                        return models.Post.create({
                            title: params.title,
                            body: _faker2.default.lorem.paragraphs(6),
                            excerpt: _faker2.default.lorem.sentences(),
                            cover_image: params.cover_image,
                            author_id: randomAuthorId,
                            type: params.type,
                            status: params.status,
                            slug: slug,
                            mode: "rich-text",
                            mdPreview: ""
                        });

                    case 7:
                        post = _context6.sent;
                        _context6.next = 10;
                        return admin.addPost(post);

                    case 10:
                        _context6.next = 12;
                        return models.Taxonomy.findAll({
                            where: { type: "post_category" }
                        });

                    case 12:
                        categories = _context6.sent;
                        _context6.next = 15;
                        return models.Taxonomy.findAll({
                            where: { type: "post_tag" }
                        });

                    case 15:
                        tags = _context6.sent;
                        _context6.next = 18;
                        return models.Post.findOne({
                            limit: 1,
                            order: [["id", "DESC"]]
                        });

                    case 18:
                        postItem = _context6.sent;
                        randomCategory = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                        _context6.next = 22;
                        return postItem.addTaxonomy(categories[randomCategory]);

                    case 22:

                        tags.forEach(function () {
                            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(tag) {
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return postItem.addTaxonomy(tag);

                                            case 2:
                                            case "end":
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this);
                            }));

                            return function (_x2) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                    case 23:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function insertPost(_x) {
        return _ref5.apply(this, arguments);
    };
}();

var insertMedia = exports.insertMedia = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(params) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return models.Media.bulkCreate([{ url: "/uploads/1.jpeg", author_id: 1 }, { url: "/uploads/2.jpeg", author_id: 1 }, { url: "/uploads/3.jpeg", author_id: 1 }, { url: "/uploads/4.jpeg", author_id: 1 }, { url: "/uploads/5.jpeg", author_id: 1 }, { url: "/uploads/6.jpeg", author_id: 1 }, { url: "/uploads/7.jpeg", author_id: 1 }, { url: "/uploads/8.jpeg", author_id: 1 }, { url: "/uploads/9.jpeg", author_id: 1 }, { url: "/uploads/10.jpeg", author_id: 1 }]);

                    case 2:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function insertMedia(_x3) {
        return _ref7.apply(this, arguments);
    };
}();

var insertSettings = exports.insertSettings = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var menu, data;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        menu = JSON.stringify([{
                            id: 3,
                            title: "Abstract",
                            type: "category",
                            name: "Home",
                            disabled: true,
                            slug: "home"
                        }, {
                            id: 1,
                            title: "Travel",
                            type: "category",
                            name: "Travel",
                            disabled: true,
                            slug: "travel"
                        }, {
                            id: 11,
                            title: "Page 2",
                            slug: "about",
                            type: "page",
                            name: "About",
                            disabled: true
                        }]);
                        data = [{
                            option: "site_title",
                            value: "Letterpad"
                        }, {
                            option: "site_tagline",
                            value: "Compose a story"
                        }, {
                            option: "site_email",
                            value: "admin@letterpad.app"
                        }, {
                            option: "site_url",
                            value: "https://letterpad.app/demo"
                        }, {
                            option: "site_footer",
                            value: ""
                        }, {
                            option: "site_description",
                            value: ""
                        }, {
                            option: "social_twitter",
                            value: "https://twitter.com"
                        }, {
                            option: "social_facebook",
                            value: "https://facebook.com"
                        }, {
                            option: "social_instagram",
                            value: "https://instagram.com"
                        }, {
                            option: "social_github",
                            value: "https://www.github.com"
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
                            option: "displayAuthorInfo",
                            value: true
                        }, {
                            option: "site_logo",
                            value: "/uploads/logo.png"
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
                            value: "hugo"
                        }, {
                            option: "disqus_id",
                            value: "letterpad"
                        }, {
                            option: "banner",
                            value: "/uploads/banner.jpg"
                        }];
                        _context8.next = 4;
                        return models.Setting.bulkCreate(data);

                    case 4:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function insertSettings() {
        return _ref8.apply(this, arguments);
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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var env = require("node-env-file");
env(__dirname + "/../../.env");


var copydir = require("copy-dir");
_faker2.default.locale = "en_US";
var models = {
    Author: _db.conn.import("../models/author"),
    Post: _db.conn.import("../models/post"),
    Taxonomy: _db.conn.import("../models/taxonomy"),
    Role: _db.conn.import("../models/role"),
    Permission: _db.conn.import("../models/permission"),
    Setting: _db.conn.import("../models/settings"),
    Media: _db.conn.import("../models/media"),
    PostTaxonomy: _db.conn.import("../models/postTaxonomy")
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
                        return insertPost({
                            title: "We encountered a new paradise",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/1.jpeg"
                        });

                    case 11:
                        _context.next = 13;
                        return insertPost({
                            title: "The Mountain",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/2.jpeg"
                        });

                    case 13:
                        _context.next = 15;
                        return insertPost({
                            title: "Ink in water",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/3.jpeg"
                        });

                    case 15:
                        _context.next = 17;
                        return insertPost({
                            title: "Future of ReactJS",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/4.jpeg"
                        });

                    case 17:
                        _context.next = 19;
                        return insertPost({
                            title: "A bright sunny day",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/5.jpeg"
                        });

                    case 19:
                        _context.next = 21;
                        return insertPost({
                            title: "Post 6",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/6.jpeg"
                        });

                    case 21:
                        _context.next = 23;
                        return insertPost({
                            title: "Post 7",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/7.jpeg"
                        });

                    case 23:
                        _context.next = 25;
                        return insertPost({
                            title: "Post 8",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/8.jpeg"
                        });

                    case 25:
                        _context.next = 27;
                        return insertPost({
                            title: "Post 9",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/9.jpeg"
                        });

                    case 27:
                        _context.next = 29;
                        return insertPost({
                            title: "Post 10",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 29:
                        _context.next = 31;
                        return insertPost({
                            title: "Post 11",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 31:
                        _context.next = 33;
                        return insertPost({
                            title: "Post 12",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 33:
                        _context.next = 35;
                        return insertPost({
                            title: "Post 13",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 35:
                        _context.next = 37;
                        return insertPost({
                            title: "Post 14",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 37:
                        _context.next = 39;
                        return insertPost({
                            title: "Post 15",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 39:
                        _context.next = 41;
                        return insertPost({
                            title: "Post 16",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 41:
                        _context.next = 43;
                        return insertPost({
                            title: "Post 17",
                            type: "post",
                            status: "publish",
                            cover_image: "/uploads/10.jpeg"
                        });

                    case 43:
                        _context.next = 45;
                        return insertPost({
                            title: "About",
                            type: "page",
                            status: "publish",
                            cover_image: "/uploads/1.jpeg"
                        });

                    case 45:
                        _context.next = 47;
                        return insertPost({
                            title: "Page 3 (draft)",
                            type: "page",
                            status: "draft"
                        });

                    case 47:
                        _context.next = 49;
                        return insertSettings();

                    case 49:
                        _context.next = 51;
                        return insertMedia();

                    case 51:
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