"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEmailBody = exports.mailTemplate = exports.NotFoundError = exports.UnauthorizedError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.formatTaxonomyForDBInsert = formatTaxonomyForDBInsert;

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

// We want to convert
// ['tag1, tag2', 'tag3, tag4', 'tag5, tag6']
// to
// [[postId,tag1], [postId,tag2], [postId + 1,tag3], [postId + 1, tag4].....
function formatTaxonomyForDBInsert(taxonomies, firstInsertID) {
    var result = [];
    taxonomies.map(function (items) {
        console.log(items);
        var taxItems = items.split(",");

        taxItems.forEach(function (taxonomy) {
            result.push([firstInsertID, taxonomy]);
        });
        firstInsertID++;
    });
    return result;
}

var UnauthorizedError = exports.UnauthorizedError = function (_Error) {
    _inherits(UnauthorizedError, _Error);

    function UnauthorizedError(_ref) {
        var _ref$statusCode = _ref.statusCode,
            statusCode = _ref$statusCode === undefined ? 401 : _ref$statusCode,
            url = _ref.url;

        _classCallCheck(this, UnauthorizedError);

        var _this = _possibleConstructorReturn(this, (UnauthorizedError.__proto__ || Object.getPrototypeOf(UnauthorizedError)).call(this, "Unauthorized request to " + url));

        _this.statusCode = statusCode;
        return _this;
    }

    _createClass(UnauthorizedError, [{
        key: "__reactstandin__regenerateByEval",
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return UnauthorizedError;
}(Error);

var NotFoundError = exports.NotFoundError = function (_Error2) {
    _inherits(NotFoundError, _Error2);

    function NotFoundError(_ref2) {
        var _ref2$statusCode = _ref2.statusCode,
            statusCode = _ref2$statusCode === undefined ? 404 : _ref2$statusCode,
            msg = _ref2.msg;

        _classCallCheck(this, NotFoundError);

        var _this2 = _possibleConstructorReturn(this, (NotFoundError.__proto__ || Object.getPrototypeOf(NotFoundError)).call(this, "Page not found"));

        _this2.statusCode = statusCode;
        return _this2;
    }

    _createClass(NotFoundError, [{
        key: "__reactstandin__regenerateByEval",
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }]);

    return NotFoundError;
}(Error);

var mailTemplate = exports.mailTemplate = function mailTemplate(_ref3) {
    var name = _ref3.name,
        body = _ref3.body,
        footer = _ref3.footer;

    return "\n        <div>\n        Hi " + name + ", <br/><br/>\n            " + body + "<br/><br/>\n        - Admin<br/>\n        </div>\n    ";
};

var getEmailBody = exports.getEmailBody = async function getEmailBody(templateName, data, models) {
    // get the template source
    var a = _fs2.default;
    var template = _fs2.default.readFileSync(_path2.default.join(__dirname, "../emails/" + templateName + ".html"), "utf-8");
    // get the settings data
    var settings = await models.Setting.findAll();
    // format the settings data into an object
    var siteData = {};
    if (settings) {
        settings.forEach(function (setting) {
            siteData[setting.option] = setting.value;
        });
    }
    // do some default replacements
    var blogname = siteData.site_title;
    var blogurl = _config2.default.rootUrl + _config2.default.baseName;
    var loginurl = blogurl + "admin/login";

    template = template.replaceAll("{{blogurl}}", blogurl);
    template = template.replaceAll("{{blogname}}", blogname);
    template = template.replaceAll("{{loginurl}}", loginurl);

    Object.keys(data).forEach(function (variable) {
        template = template.replaceAll("{{" + variable + "}}", data[variable]);
    });
    return template;
};
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(formatTaxonomyForDBInsert, "formatTaxonomyForDBInsert", "api/utils/common.js");
    reactHotLoader.register(UnauthorizedError, "UnauthorizedError", "api/utils/common.js");
    reactHotLoader.register(NotFoundError, "NotFoundError", "api/utils/common.js");
    reactHotLoader.register(mailTemplate, "mailTemplate", "api/utils/common.js");
    reactHotLoader.register(getEmailBody, "getEmailBody", "api/utils/common.js");
    leaveModule(module);
})();

;