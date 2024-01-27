module.exports = {
  extends: ["next", "turbo", "prettier", "next/core-web-vitals"],
  globals: {
    React: true,
    JSX: true,
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "prettier/prettier": "error",
    "turbo/no-undeclared-env-vars": "off",
    "react/react-in-jsx-scope": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "import/no-duplicates": ["error", {"considerQueryString": true}],
    "react/prop-types": 0,
    "no-unused-vars": "off",
    // "no-unused-vars": ["error", { "vars": "local",'argsIgnorePattern': '^_' }],
    "react/no-unescaped-entities": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    // "no-unused-vars": "off",
    "no-console": "error",
    "import/no-anonymous-default-export": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-nocheck": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    // Sort
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // ext library & side effect imports
          ["^@?\\w", "^\\u0000"],
          // {s}css files
          ["^.+\\.s?css$"],
          // Lib and hooks
          ["^@/lib", "^@/hooks"],
          // static data
          ["^@/data"],
          // components
          ["^@/components"],
          // Other imports
          ["^@/"],
          // relative paths up until 3 level
          [
            "^\\./?$",
            "^\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\./\\.\\.(?!/?$)",
          ],
          ["^@/types"],
          // other that didnt fit in
          ["^"],
        ],
      },
    ],
  },
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "eslint-plugin-prettier",
  ],
};
