const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/",
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper,
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["src", "node_modules", "tests"],
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  transform: {
    "\\.(gql|graphqls)$": "@graphql-tools/jest-transform",
  },
  setupFilesAfterEnv: [`<rootDir>/tests/testSetup.ts`],
  testMatch: ["**/**/*.test.ts"],
};
