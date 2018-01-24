module.exports = {
    extends: ["eslint:recommended", "plugin:react/recommended"],
    env: {
        es6: true,
        browser: true,
        commonjs: true,
        node: fase
    },
    parser: "babel-eslint",
    rules: {
        quotes: [2, "double", { avoidEscape: true }],
        indent: ["error", 4, { SwitchCase: 1 }],
        "comma-dangle": ["error", "never"],
        "function-paren-newline": ["error", "consistent"],
        "no-restricted-syntax": [
            "error",
            "FunctionExpression",
            "WithStatement",
            "BinaryExpression[operator='in']"
        ],
        "arrow-parens": ["error", "as-needed"],
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "jsx-a11y/anchor-is-valid": [
            "error",
            { components: ["Link"], specialLink: ["to"] }
        ],
        "react/prefer-stateless-function": [0],
        "react/no-multi-comp": [0],
        "react/require-default-props": [0],
        "jsx-a11y/label-has-for": [0],
        "react/forbid-prop-types": [0],
        "jsx-a11y/click-events-have-key-events": [0],
        "jsx-a11y/anchor-is-valid": [0],
        "prefer-template": [0],
        "jsx-a11y/no-static-element-interactions": [0]
    }
};
