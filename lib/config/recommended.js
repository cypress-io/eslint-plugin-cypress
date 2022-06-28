'use strict'

module.exports = {
  plugins: ['@finsit/cypress'],
  env: {
    '@finsit/cypress/globals': true,
  },
  rules: {
    '@finsit/cypress/no-assigning-return-values': 'error',
    '@finsit/cypress/no-unnecessary-waiting': 'error',
    '@finsit/cypress/no-async-tests': 'error',
  },
}
