const env = require("node-env-file");
const ROOT_DIR = process.env.ROOT || __dirname + "/..";

if (process.env.NODE_ENV === "production") {
  env(ROOT_DIR + "/.env.production.local");
} else {
  env(ROOT_DIR + "/.env.development.local");
}

export {};
