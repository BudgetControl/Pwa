import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue-cli',
      bundler: 'webpack',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:8080', // URL locale del dev server
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
