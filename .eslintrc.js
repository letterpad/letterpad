module.exports = {
    extends: "airbnb",
    rules: {
        quotes: [2, "double", { avoidEscape: true }],
        indent: ["error", 4, { SwitchCase: 1 }],
        "comma-dangle": ["error", "never"],
        "function-paren-newline": ["error", "consistent"],
        "no-restricted-syntax": ["error", "never"],
        "arrow-parens": ["error", "as-needed"],
        "no-underscore-dangle": ["error", "never"]
    }
};
