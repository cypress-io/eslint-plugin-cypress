import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import nodePlugin from 'eslint-plugin-n'
import mochaPlugin from 'eslint-plugin-mocha'

export default [
  pluginJs.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended-script'],
  mochaPlugin.configs.flat.recommended,
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
      'n/no-extraneous-require':
        ['error', { 'allowModules': ['jest-config'] }],
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off'
    }
  },
]
