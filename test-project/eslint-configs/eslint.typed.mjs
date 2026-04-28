// All recommended rules are applied, except cypress/no-unnecessary-waiting
// TypeScript parser is used for type-aware linting with a minimal tsconfig.json
import { defineConfig } from 'eslint/config'
import pluginCypress from 'eslint-plugin-cypress'
import typescriptParser from '@typescript-eslint/parser'

export default defineConfig([
  {
    files: ['cypress/**/*.js'],
    extends: [
      pluginCypress.configs.recommended,
    ],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        projectService: true,
      },
    },
  },
])
