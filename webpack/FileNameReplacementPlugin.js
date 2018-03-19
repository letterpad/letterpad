var fs = require("fs");
var path = require("path");

var FileNameReplacementPlugin = function(theme) {
    const target = "/client/themes/" + theme + "/";
    return {
        apply: function(compiler) {
            compiler.plugin(
                "normal-module-factory",

                function(normalModuleFactory) {
                    normalModuleFactory.plugin(
                        "after-resolve",

                        function(result, callback) {
                            result = validateAndReplace(result, target);
                            return callback(null, result);
                        }
                    );
                }
            );
        }
    };
};
function validateAndReplace(result, target) {
    ["request", "userRequest", "resource"].forEach(function(key) {
        if (!result[key].includes("/node_modules/")) {
            if (result[key].includes("/client/")) {
                var replacement = result[key].replace("/client/", target);
                if (fs.existsSync(path.resolve(replacement))) {
                    console.log("replaced", replacement);
                    result[key] = replacement;
                }
            }
        }
    });

    return result;
}
module.exports = FileNameReplacementPlugin;
