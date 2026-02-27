import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:5173/robin-ci-cd-ynov/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
