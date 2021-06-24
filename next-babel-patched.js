// Source: https://github.com/vercel/next.js/blob/canary/packages/next/build/babel/preset.ts
//
// Changes:
// removed babel-proposal-class-properties plugin
//
// This is because this preset includes babel-proposal-class-properties plugin
// and it causes these issue with sequelize
//
// https://github.com/sequelize/sequelize/issues/10579#issuecomment-574604414
// https://github.com/RobinBuschmann/sequelize-typescript/issues/612#issuecomment-583728166
//
// where public a!: number is transformed to _defineProperty("a", undefined) unwantedly
// and "a" is already declared by `super` class. So, the define property just overwrites
// prototype unnecessarily.

const { dirname } = require("path");
const isLoadIntentTest = process.env.NODE_ENV === "test";
const isLoadIntentDevelopment = process.env.NODE_ENV === "development";

// Resolve styled-jsx plugins
function styledJsxOptions(options) {
  if (!options) {
    return {};
  }
  if (!Array.isArray(options.plugins)) {
    return options;
  }
  options.plugins = options.plugins.map((plugin) => {
    if (Array.isArray(plugin)) {
      const [name, pluginOptions] = plugin;
      return [require.resolve(name), pluginOptions];
    }
    return require.resolve(plugin);
  });
  return options;
}

// Taken from https://github.com/babel/babel/commit/d60c5e1736543a6eac4b549553e107a9ba967051#diff-b4beead8ad9195361b4537601cc22532R158
function supportsStaticESM(caller) {
  return !!(caller === null || caller === void 0
    ? void 0
    : caller.supportsStaticESM);
}

module.exports = (api, options = {}) => {
  var _a, _b;
  const supportsESM = api.caller(supportsStaticESM);
  const isServer = api.caller((caller) => !!caller && caller.isServer);
  const isCallerDevelopment = api.caller((caller) =>
    caller === null || caller === void 0 ? void 0 : caller.isDev,
  );
  // Look at external intent if used without a caller (e.g. via Jest):
  const isTest = isCallerDevelopment == null && isLoadIntentTest;
  // Look at external intent if used without a caller (e.g. Storybook):
  const isDevelopment =
    isCallerDevelopment === true ||
    (isCallerDevelopment == null && isLoadIntentDevelopment);
  // Default to production mode if not `test` nor `development`:
  const isProduction = !(isTest || isDevelopment);
  const isBabelLoader = api.caller(
    (caller) =>
      !!caller &&
      (caller.name === "babel-loader" ||
        caller.name === "next-babel-turbo-loader"),
  );
  const useJsxRuntime =
    ((_a = options["preset-react"]) === null || _a === void 0
      ? void 0
      : _a.runtime) === "automatic" ||
    (Boolean(api.caller((caller) => !!caller && caller.hasJsxRuntime)) &&
      ((_b = options["preset-react"]) === null || _b === void 0
        ? void 0
        : _b.runtime) !== "classic");
  const presetEnvConfig = Object.assign(
    {
      // In the test environment `modules` is often needed to be set to true, babel figures that out by itself using the `'auto'` option
      // In production/development this option is set to `false` so that webpack can handle import/export with tree-shaking
      modules: "auto",
      exclude: ["transform-typeof-symbol"],
      include: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator",
      ],
    },
    options["preset-env"],
  );
  // When transpiling for the server or tests, target the current Node version
  // if not explicitly specified:
  if (
    (isServer || isTest) &&
    (!presetEnvConfig.targets ||
      !(
        typeof presetEnvConfig.targets === "object" &&
        "node" in presetEnvConfig.targets
      ))
  ) {
    presetEnvConfig.targets = {
      // Targets the current process' version of Node. This requires apps be
      // built and deployed on the same version of Node.
      node: "current",
    };
  }
  return {
    sourceType: "unambiguous",
    presets: [
      [require("next/dist/compiled/babel/preset-env"), presetEnvConfig],
      [
        require("next/dist/compiled/babel/preset-react"),
        Object.assign(
          Object.assign(
            {
              // This adds @babel/plugin-transform-react-jsx-source and
              // @babel/plugin-transform-react-jsx-self automatically in development
              development: isDevelopment || isTest,
            },
            useJsxRuntime ? { runtime: "automatic" } : { pragma: "__jsx" },
          ),
          options["preset-react"],
        ),
      ],
      [
        require("next/dist/compiled/babel/preset-typescript"),
        Object.assign({ allowNamespaces: true }, options["preset-typescript"]),
      ],
    ],
    plugins: [
      !useJsxRuntime && [
        require("next/dist/build/babel/plugins/jsx-pragma"),
        {
          // This produces the following injected import for modules containing JSX:
          //   import React from 'react';
          //   var __jsx = React.createElement;
          module: "react",
          importAs: "React",
          pragma: "__jsx",
          property: "createElement",
        },
      ],
      [
        require("next/dist/build/babel/plugins/optimize-hook-destructuring"),
        {
          // only optimize hook functions imported from React/Preact
          lib: true,
        },
      ],
      require("next/dist/compiled/babel/plugin-syntax-dynamic-import"),
      require("next/dist/build/babel/plugins/react-loadable-plugin"),
      [
        require("next/dist/compiled/babel/plugin-proposal-object-rest-spread"),
        {
          useBuiltIns: true,
        },
      ],
      !isServer && [
        require("next/dist/compiled/babel/plugin-transform-runtime"),
        Object.assign(
          {
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: supportsESM && presetEnvConfig.modules !== "commonjs",
            absoluteRuntime: isBabelLoader
              ? dirname(require.resolve("@babel/runtime/package.json"))
              : undefined,
          },
          options["transform-runtime"],
        ),
      ],
      [
        isTest && options["styled-jsx"] && options["styled-jsx"]["babel-test"]
          ? require("styled-jsx/babel-test")
          : require("styled-jsx/babel"),
        styledJsxOptions(options["styled-jsx"]),
      ],
      require("next/dist/build/babel/plugins/amp-attributes"),
      isProduction && [
        require("next/dist/compiled/babel/plugin-transform-react-remove-prop-types"),
        {
          removeImport: true,
        },
      ],
      isServer && require("next/dist/compiled/babel/plugin-syntax-bigint"),
      // Always compile numeric separator because the resulting number is
      // smaller.
      require("next/dist/compiled/babel/plugin-proposal-numeric-separator"),
      require("next/dist/compiled/babel/plugin-proposal-export-namespace-from"),
    ].filter(Boolean),
  };
};
