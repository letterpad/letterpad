import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 12000,
  projectId: "x2wi9m",
  env: {
    CYPRESS_NODE_ENV: "test",
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts").default(on, config);
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
