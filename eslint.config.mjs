import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import mochaPlugin from 'eslint-plugin-mocha'
import stylistic from '@stylistic/eslint-plugin'

export default [
  pluginJs.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  mochaPlugin.configs.recommended,
  stylistic.configs.recommended,
  {
    ignores: [
      'test-project/**/*',
      '!test-project/**/eslint*',
    ],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
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
  },
]
