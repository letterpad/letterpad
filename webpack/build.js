const {
  printFileSizesAfterBuild,
  measureFileSizesBeforeBuild,
} = require("./stats/reporter");

class FormatStats {
  constructor(options) {
    this.env = options.env;
  }

  apply(compiler) {
    compiler.hooks.done.tap("done", stats => {
      if (this.env !== "production") return;
      return printFileSizesAfterBuild(stats, this.previousSizeMap, "dist");
    });

    compiler.hooks.beforeCompile.tapAsync("beforeRun", (params, callback) => {
      if (this.env !== "production") return callback();
      measureFileSizesBeforeBuild("dist").then(sizeMap => {
        this.previousSizeMap = sizeMap;
        callback();
      });
    });
  }
}

module.exports = FormatStats;
