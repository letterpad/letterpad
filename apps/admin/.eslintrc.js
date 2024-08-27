module.exports = {
  root: true,
  extends: ["custom"],
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ["**/dist/**/*.js","**/*.js"],
};
