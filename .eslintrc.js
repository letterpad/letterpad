module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
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
        process: true
    },
    rules: {
        indent: [2, 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "react/display-name": 0
    }
};
