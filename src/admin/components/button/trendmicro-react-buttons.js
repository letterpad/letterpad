/*! react-buttons v1.3.1 | (c) 2020 Trend Micro Inc. | MIT | https://github.com/trendmicro-frontend/react-buttons */
module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 6));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports) {
      module.exports = require("classnames");

      /***/
    },
    /* 1 */
    /***/ function(module, exports) {
      module.exports = require("react");

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      // removed by extract-text-webpack-plugin
      module.exports = {
        btn: "buttons---btn---2jZHN",
        active: "buttons---active---2-a32",
        focus: "buttons---focus---1kVJZ",
        hover: "buttons---hover---42FF2",
        disabled: "buttons---disabled---eCY9b",
        "btn-default": "buttons---btn-default---1wWXD",
        btnDefault: "buttons---btn-default---1wWXD",
        "btn-primary": "buttons---btn-primary---Wp1wb",
        btnPrimary: "buttons---btn-primary---Wp1wb",
        "btn-success": "buttons---btn-success---1kbT5",
        btnSuccess: "buttons---btn-success---1kbT5",
        "theme-dark": "buttons---theme-dark---39Bq0",
        themeDark: "buttons---theme-dark---39Bq0",
        "btn-danger": "buttons---btn-danger---1UUqU",
        btnDanger: "buttons---btn-danger---1UUqU",
        "btn-border": "buttons---btn-border---1O58b",
        btnBorder: "buttons---btn-border---1O58b",
        open: "buttons---open---1ju75",
        "dropdown-toggle": "buttons---dropdown-toggle---vMtjL",
        dropdownToggle: "buttons---dropdown-toggle---vMtjL",
        "btn-link": "buttons---btn-link---1xwS4",
        btnLink: "buttons---btn-link---1xwS4",
        "btn-lg": "buttons---btn-lg---2xtUV",
        btnLg: "buttons---btn-lg---2xtUV",
        "btn-group-lg": "buttons---btn-group-lg---3C8An",
        btnGroupLg: "buttons---btn-group-lg---3C8An",
        "btn-compact": "buttons---btn-compact---mXDAU",
        btnCompact: "buttons---btn-compact---mXDAU",
        "btn-md": "buttons---btn-md---HRR_F",
        btnMd: "buttons---btn-md---HRR_F",
        "btn-group-md": "buttons---btn-group-md---3FQVP",
        btnGroupMd: "buttons---btn-group-md---3FQVP",
        "btn-sm": "buttons---btn-sm---3cNnY",
        btnSm: "buttons---btn-sm---3cNnY",
        "btn-group-sm": "buttons---btn-group-sm---3_QLf",
        btnGroupSm: "buttons---btn-group-sm---3_QLf",
        "btn-xs": "buttons---btn-xs---2eEDQ",
        btnXs: "buttons---btn-xs---2eEDQ",
        "btn-group-xs": "buttons---btn-group-xs---1c4pb",
        btnGroupXs: "buttons---btn-group-xs---1c4pb",
        "btn-block": "buttons---btn-block---1nSNV",
        btnBlock: "buttons---btn-block---1nSNV",
        "btn-group": "buttons---btn-group---1jaDo",
        btnGroup: "buttons---btn-group---1jaDo",
        "btn-group-vertical": "buttons---btn-group-vertical---3Lm1e",
        btnGroupVertical: "buttons---btn-group-vertical---3Lm1e",
        "btn-toolbar": "buttons---btn-toolbar---2-GfJ",
        btnToolbar: "buttons---btn-toolbar---2-GfJ",
        "input-group": "buttons---input-group---1T18I",
        inputGroup: "buttons---input-group---1T18I",
        "btn-group-justified": "buttons---btn-group-justified---3qB9u",
        btnGroupJustified: "buttons---btn-group-justified---3qB9u",
        "dropdown-menu": "buttons---dropdown-menu---1fkH0",
        dropdownMenu: "buttons---dropdown-menu---1fkH0",
      };

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      var _class, _temp;

      var _classnames = __webpack_require__(0);

      var _classnames2 = _interopRequireDefault(_classnames);

      var _propTypes = __webpack_require__(4);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __webpack_require__(1);

      var _react2 = _interopRequireDefault(_react);

      var _constants = __webpack_require__(5);

      var _index = __webpack_require__(2);

      var _index2 = _interopRequireDefault(_index);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }
        return target;
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called",
          );
        }
        return call && (typeof call === "object" || typeof call === "function")
          ? call
          : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof superClass,
          );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        if (superClass)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
      }

      var Button =
        ((_temp = _class = (function(_PureComponent) {
          _inherits(Button, _PureComponent);

          function Button() {
            _classCallCheck(this, Button);

            return _possibleConstructorReturn(
              this,
              (Button.__proto__ || Object.getPrototypeOf(Button)).apply(
                this,
                arguments,
              ),
            );
          }

          _createClass(Button, [
            {
              key: "render",
              value: function render() {
                var _classes;

                var _props = this.props,
                  className = _props.className,
                  Component = _props.componentClass,
                  type = _props.type,
                  btnSize = _props.btnSize,
                  btnStyle = _props.btnStyle,
                  active = _props.active,
                  hover = _props.hover,
                  focus = _props.focus,
                  disabled = _props.disabled,
                  block = _props.block,
                  compact = _props.compact,
                  iconOnly = _props.iconOnly,
                  dropdownToggle = _props.dropdownToggle,
                  props = _objectWithoutProperties(_props, [
                    "className",
                    "componentClass",
                    "type",
                    "btnSize",
                    "btnStyle",
                    "active",
                    "hover",
                    "focus",
                    "disabled",
                    "block",
                    "compact",
                    "iconOnly",
                    "dropdownToggle",
                  ]);

                var classes =
                  ((_classes = {}),
                  _defineProperty(_classes, _index2.default.btn, true),
                  _defineProperty(
                    _classes,
                    _index2.default.btnLg,
                    btnSize === "large" || btnSize === "lg",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnMd,
                    btnSize === "medium" || btnSize === "md",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnSm,
                    btnSize === "small" || btnSize === "sm",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnXs,
                    btnSize === "extra-small" || btnSize === "xs",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnDefault,
                    btnStyle === "default",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnPrimary,
                    btnStyle === "primary",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnSuccess,
                    btnStyle === "success",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnDanger,
                    btnStyle === "danger" || btnStyle === "emphasis",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnBorder,
                    btnStyle === "border" || btnStyle === "flat",
                  ),
                  _defineProperty(
                    _classes,
                    _index2.default.btnLink,
                    btnStyle === "link",
                  ),
                  _defineProperty(_classes, _index2.default.btnBlock, block),
                  _defineProperty(
                    _classes,
                    _index2.default.btnCompact,
                    compact || iconOnly,
                  ),
                  _defineProperty(_classes, _index2.default.hover, hover),
                  _defineProperty(_classes, _index2.default.active, active),
                  _defineProperty(_classes, _index2.default.focus, focus),
                  _defineProperty(
                    _classes,
                    _index2.default.dropdownToggle,
                    dropdownToggle,
                  ),
                  _classes);

                return _react2.default.createElement(
                  Component,
                  _extends({}, props, {
                    type: type,
                    className: (0, _classnames2.default)(className, classes),
                    disabled: disabled,
                  }),
                );
              },
            },
          ]);

          return Button;
        })(_react.PureComponent)),
        (_class.propTypes = {
          componentClass: _propTypes2.default.oneOfType([
            _propTypes2.default.func,
            _propTypes2.default.string,
          ]),
          type: _propTypes2.default.oneOf(["button", "reset", "submit"]),
          btnSize: _propTypes2.default.oneOf(_constants.btnSizes),
          btnStyle: _propTypes2.default.oneOf(_constants.btnStyles),
          active: _propTypes2.default.bool,
          hover: _propTypes2.default.bool,
          focus: _propTypes2.default.bool,
          disabled: _propTypes2.default.bool,
          block: _propTypes2.default.bool,
          compact: _propTypes2.default.bool,
          iconOnly: _propTypes2.default.bool, // alias of compact

          // Apply styles for use in a Dropdown.
          // This prop will be set automatically when the Button is used inside a Dropdown.
          dropdownToggle: _propTypes2.default.bool,
        }),
        (_class.defaultProps = {
          componentClass: "button",
          type: "button",
          btnSize: "md",
          btnStyle: "default",
          active: false,
          hover: false,
          focus: false,
          disabled: false,
          block: false,
          compact: false,
          iconOnly: false, // alias of compact
          dropdownToggle: false,
        }),
        _temp);
      exports.default = Button;

      /***/
    },
    /* 4 */
    /***/ function(module, exports) {
      module.exports = require("prop-types");

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      var btnSizes = (exports.btnSizes = [
        "lg",
        "md",
        "sm",
        "xs",
        "large",
        "medium",
        "small",
        "extra-small",
      ]);

      var btnStyles = (exports.btnStyles = [
        "default",
        "primary",
        "danger",
        "emphasis", // alias of "danger"
        "border",
        "flat", // alias of "border"
        "link",
        "success",
      ]);

      /***/
    },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.ButtonToolbar = exports.ButtonGroup = exports.Button = undefined;

      var _Button2 = __webpack_require__(3);

      var _Button3 = _interopRequireDefault(_Button2);

      var _ButtonGroup2 = __webpack_require__(7);

      var _ButtonGroup3 = _interopRequireDefault(_ButtonGroup2);

      var _ButtonToolbar2 = __webpack_require__(8);

      var _ButtonToolbar3 = _interopRequireDefault(_ButtonToolbar2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.Button = _Button3.default;
      exports.ButtonGroup = _ButtonGroup3.default;
      exports.ButtonToolbar = _ButtonToolbar3.default;

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      var _classnames = __webpack_require__(0);

      var _classnames2 = _interopRequireDefault(_classnames);

      var _propTypes = __webpack_require__(4);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __webpack_require__(1);

      var _react2 = _interopRequireDefault(_react);

      var _Button = __webpack_require__(3);

      var _Button2 = _interopRequireDefault(_Button);

      var _constants = __webpack_require__(5);

      var _index = __webpack_require__(2);

      var _index2 = _interopRequireDefault(_index);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }
        return target;
      }

      var getComponentType = function getComponentType(Component) {
        return Component
          ? _react2.default.createElement(Component, null).type
          : undefined;
      };

      var ButtonGroup = function ButtonGroup(_ref) {
        var _classes;

        var btnSize = _ref.btnSize,
          btnStyle = _ref.btnStyle,
          vertical = _ref.vertical,
          dropdownOpen = _ref.dropdownOpen,
          children = _ref.children,
          className = _ref.className,
          props = _objectWithoutProperties(_ref, [
            "btnSize",
            "btnStyle",
            "vertical",
            "dropdownOpen",
            "children",
            "className",
          ]);

        var classes =
          ((_classes = {}),
          _defineProperty(_classes, _index2.default.btnGroup, true),
          _defineProperty(
            _classes,
            _index2.default.btnGroupLg,
            btnSize === "large" || btnSize === "lg",
          ),
          _defineProperty(
            _classes,
            _index2.default.btnGroupMd,
            btnSize === "medium" || btnSize === "md",
          ),
          _defineProperty(
            _classes,
            _index2.default.btnGroupSm,
            btnSize === "small" || btnSize === "sm",
          ),
          _defineProperty(
            _classes,
            _index2.default.btnGroupXs,
            btnSize === "extra-small" || btnSize === "xs",
          ),
          _defineProperty(_classes, _index2.default.btnGroupVertical, vertical),
          _defineProperty(_classes, _index2.default.open, dropdownOpen),
          _classes);

        return _react2.default.createElement(
          "div",
          _extends({}, props, {
            className: (0, _classnames2.default)(className, classes),
          }),
          _react2.default.Children.map(children, function(child) {
            if (
              _react2.default.isValidElement(child) &&
              child.type === getComponentType(_Button2.default)
            ) {
              var childProps = {};
              if (_constants.btnSizes.indexOf(btnSize) >= 0) {
                childProps.btnSize = btnSize;
              }
              if (_constants.btnStyles.indexOf(btnStyle) >= 0) {
                childProps.btnStyle = btnStyle;
              }
              return (0, _react.cloneElement)(child, childProps);
            }

            return child;
          }),
        );
      };

      ButtonGroup.propTypes = {
        btnSize: _propTypes2.default.oneOf(_constants.btnSizes),
        btnStyle: _propTypes2.default.oneOf(_constants.btnStyles),
        vertical: _propTypes2.default.bool,

        // Apply styles for use in a Dropdown.
        // This prop will be set automatically when the ButtonGroup is used inside a Dropdown.
        dropdownOpen: _propTypes2.default.bool,
      };
      ButtonGroup.defaultProps = {
        vertical: false,
        dropdownOpen: false,
      };

      exports.default = ButtonGroup;

      /***/
    },
    /* 8 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });

      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };

      var _classnames = __webpack_require__(0);

      var _classnames2 = _interopRequireDefault(_classnames);

      var _react = __webpack_require__(1);

      var _react2 = _interopRequireDefault(_react);

      var _index = __webpack_require__(2);

      var _index2 = _interopRequireDefault(_index);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }
        return target;
      }

      var ButtonToolbar = function ButtonToolbar(_ref) {
        var className = _ref.className,
          props = _objectWithoutProperties(_ref, ["className"]);

        return _react2.default.createElement(
          "div",
          _extends({}, props, {
            className: (0, _classnames2.default)(
              className,
              _index2.default.btnToolbar,
            ),
          }),
        );
      };

      exports.default = ButtonToolbar;

      /***/
    },
    /******/
  ],
);
//# sourceMappingURL=index.js.map
