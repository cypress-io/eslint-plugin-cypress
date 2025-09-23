// All recommended rules are applied, except cypress/no-unnecessary-waiting
import { defineConfig } from 'eslint/config'
import pluginCypress from 'eslint-plugin-cypress'
export default defineConfig([
  {
    files: ['cypress/**/*.js'],
    extends: [
      pluginCypress.configs.recommended,
    ],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
])
