const {
  printFileSizesAfterBuild,
  measureFileSizesBeforeBuild,
} = require("./stats/reporter");

class FormatStats {
  apply(compiler) {
    compiler.hooks.done.tap("done", stats => {
      if (process.env.NODE_ENV !== "production") return;
      return printFileSizesAfterBuild(stats, this.previousSizeMap, "dist");
    });

    compiler.hooks.beforeCompile.tapAsync("beforeRun", (params, callback) => {
      if (process.env.NODE_ENV !== "production") return callback();
      measureFileSizesBeforeBuild("dist").then(sizeMap => {
        this.previousSizeMap = sizeMap;
        callback();
      });
    });
  }
}

module.exports = FormatStats;
