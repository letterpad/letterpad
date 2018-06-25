module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: "module"
    },
    plugins: ["react"],
    globals: {
        qEditor: true,
        Quill: true,
        process: true,
        hljs: true,
        ga: true,
        Masonry: true,
        __dirname: true
    },
    rules: {
        "react/no-deprecated": 0,
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "react/display-name": 0,
        "no-console": 0
    }
};
