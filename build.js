// "use strict";

// const { spawn } = require("child_process");
// const child = spawn("npm", ["run", "build"]);

// child.stdout.setEncoding("utf8");
// // use child.stdout.setEncoding('utf8'); if you want text chunks
// child.stdout.on("data", chunk => {
//     //console.log(chunk);
//     // data from standard output is here as buffers
// });

// // since these are streams, you can pipe them elsewhere
// // child.stderr.pipe(dest);

// child.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });

var webpack = require("webpack");
var ProgressPlugin = require("webpack/lib/ProgressPlugin");
var config = require("./webpack.config.prod.js");
var compiler = webpack(config);
compiler.apply(
    new ProgressPlugin(function(percentage, msg) {
        console.log(percentage * 100 + "%", msg);
    })
);

compiler.run(function(err, stats) {
    // ...
});
// compiler.apply(
//     new ProgressPlugin(function(percentage, msg, current, active, modulepath) {
//         if (process.stdout.isTTY && percentage < 1) {
//             process.stdout.cursorTo(0);
//             modulepath = modulepath
//                 ? " …" + modulepath.substr(modulepath.length - 30)
//                 : "";
//             current = current ? " " + current : "";
//             active = active ? " " + active : "";
//             process.stdout.write(
//                 (percentage * 100).toFixed(0) +
//                     "% " +
//                     msg +
//                     current +
//                     active +
//                     modulepath +
//                     " "
//             );
//             process.stdout.clearLine(1);
//         } else if (percentage === 1) {
//             process.stdout.write("\n");
//             console.log("webpack: done.");
//         }
//     })
// );

// compiler.run(function(err, stats) {
//     if (err) throw err;
//     process.stdout.write(
//         stats.toString({
//             colors: true,
//             modules: false,
//             children: false,
//             chunks: false,
//             chunkModules: false
//         }) + "\n\n"
//     );
// });
