/**
 * This file most probably will not be used. This is the file provided in main in package.json.
 * I imagine this is mostly used in libraries or if letterpad is a dependency for another project.
 */
const exec = require("child_process").exec;

// exec("node apiBuild/server.js");
exec("node ./server.js");
