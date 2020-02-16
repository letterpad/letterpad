try {
  // this is required only in dev environment as we have import statements in dependency modules.
  // In production, this wont be required.
  require("@babel/polyfill");
  require("@babel/register")({
    plugins: ["@babel/plugin-syntax-dynamic-import"],
    presets: [["@babel/env"]],
  });
} catch (e) {
  //
}
const env = require("node-env-file");
env(__dirname + "/../../../.env");
const models = require("../../api/models/index").default;
const { seed } = require("./seed");
seed(models).catch(e => {
  console.error(e);
  process.exit(1);
});
