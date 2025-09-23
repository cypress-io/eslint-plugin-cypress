// eslint-plugin-cypress/flat is deprecated and is identical to
// eslint-plugin-cypress
// Plugin activated, only one rule applied
import { defineConfig } from 'eslint/config'
import pluginCypress from 'eslint-plugin-cypress/flat'
export default defineConfig([
  {
    plugins: {
      cypress: pluginCypress,
    },
    rules: {
      'cypress/unsafe-to-chain-command': 'error',
    },
  },
])
