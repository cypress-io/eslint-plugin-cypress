import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import mochaPlugin from 'eslint-plugin-mocha'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default defineConfig([

  globalIgnores(['test-project/**/*', '!test-project/**/eslint*']),

  {
    files: ['**/*.{,m}js'],
    extends: [
      js.configs.recommended,
      eslintPlugin.configs.recommended,
      mochaPlugin.configs.recommended,
      stylistic.configs.recommended,
    ],
    rules: {
      'no-redeclare': 'off',
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      'eslint-plugin/require-meta-docs-url':
        ['error', { pattern: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/{{name}}.md' }],
      'eslint-plugin/require-meta-docs-description': 'error',
      'eslint-plugin/meta-property-ordering': 'error',
      'eslint-plugin/test-case-property-ordering': 'error',
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off',
    },
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.d.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      stylistic.configs.recommended,
    ],
  },
])
