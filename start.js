var exec = require("child_process").exec;

exec("node_modules/.bin/nodemon -w api ./api/start.js");
setTimeout(() => {
    exec("node ./server.js");
}, 3000);
