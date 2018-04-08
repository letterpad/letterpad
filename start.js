var exec = require("child_process").exec;

exec("node_modules/.bin/nodemon -w api ./api/server.js");
setTimeout(() => {
    exec("node ./server.js");
}, 3000);
