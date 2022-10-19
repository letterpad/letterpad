const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/",
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper,
  moduleDirectories: ["src", "node_modules", "tests"],
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  setupFilesAfterEnv: [`<rootDir>/tests/testSetup.ts`],
  testMatch: ["**/**/*.test.ts"],
};
