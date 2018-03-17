/**
 * @module WebpackOnBuildPlugin
 */

/**
 * @constructor
 * @param {onBuildCallback} callback - will be called right after build.
 */
function AfterBuild(callback) {
    this.callback = callback;
}

/**
 * @callback onBuildCallback
 * @param {object} stats - webpack stats object
 */

/**
 * @param {object} compiler
 */
AfterBuild.prototype.apply = function(compiler) {
    compiler.plugin("done", this.callback);
};

module.exports = AfterBuild;
