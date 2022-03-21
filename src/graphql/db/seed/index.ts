const { exec } = require("child_process");
require("@/config/env");

const execShellCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(stdout || stderr);
        resolve(null);
      }
    });
  });
};

let schema = "schema.prisma";
if (process.env.DATABASE_URL.startsWith("mysql")) {
  schema = "schema_mysql.prisma";
}

function init() {
  execShellCommand(
    `DATABASE_URL='${process.env.DATABASE_URL}' npx prisma db push --force-reset --schema prisma/${schema}`,
  ).then(() => {
    const { seed } = require("./seed");
    seed()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .then(() => {
        process.exit(0);
      });
  });
}

init();
export {};
