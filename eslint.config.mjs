import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import mochaPlugin from 'eslint-plugin-mocha'

export default [
  pluginJs.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  mochaPlugin.configs.flat.recommended,
  {ignores: ['test-project/']},
  {
    languageOptions: {
      globals: globals.node
    },
    rules: {
      'no-redeclare': 'off',
      'eslint-plugin/require-meta-docs-url':
        ['error', { 'pattern': 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/{{name}}.md' }],
      'eslint-plugin/require-meta-docs-description': 'error',
      'eslint-plugin/meta-property-ordering': 'error',
      'eslint-plugin/test-case-property-ordering': 'error',
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off'
    }
  },
]
