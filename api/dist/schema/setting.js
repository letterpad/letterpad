"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = "\n  type Setting {\n    id: Int\n    option: String\n    value: String\n  }\n  input OptionInputType {\n    id: Int\n    option: String\n    value: String\n  }\n  \n  type Query {\n    settings(option: String):[Setting]\n  }\n\n  type Mutation {\n    updateOptions(options:[OptionInputType]): [Setting]\n  }\n";
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "api/schema/setting.js");
  leaveModule(module);
})();

;