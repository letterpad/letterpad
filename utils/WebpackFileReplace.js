var path = require("path");
var fs = require("fs");

function validateAndReplace(result) {
  ["request", "userRequest", "resource"].forEach(function(key) {
    if (!result[key].includes("/node_modules/")) {
      if (result[key].includes("/admin/")) {
        var replacement = result[key].replace("/admin/", "/extend/admin/");

        if (fs.existsSync(path.resolve(replacement))) {
          result[key] = replacement;
        }
      } else if (result[key].includes("/client/")) {
        var replacement = result[key].replace("/client/", "/extend/client/");

        if (fs.existsSync(path.resolve(replacement))) {
          result[key] = replacement;
        }
      } else if (result[key].includes("/shared/")) {
        var replacement = result[key].replace("/shared/", "/extend/shared/");

        if (fs.existsSync(path.resolve(replacement))) {
          result[key] = replacement;
        }
      }
    }
  });

  return result;
}

var FileNameReplacementPlugin = function(folder) {
  return {
    apply: function(compiler) {
      compiler.plugin(
        "normal-module-factory",

        function(normalModuleFactory) {
          normalModuleFactory.plugin(
            "after-resolve",

            function(result, callback) {
              result = validateAndReplace(result);
              return callback(null, result);
            },
          );
        },
      );
    },
  };
};

module.exports = FileNameReplacementPlugin;
