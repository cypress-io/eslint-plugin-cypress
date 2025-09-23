// Plugin activated, only one rule applied
import { defineConfig } from 'eslint/config'
import pluginCypress from 'eslint-plugin-cypress'
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
