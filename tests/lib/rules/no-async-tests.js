'use strict'

const rule = require('../../../lib/rules/no-async-tests')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
// async functions are an ES2017 feature
const languageOptions = { ecmaVersion: 8 }

ruleTester.run('no-async-tests', rule, {
  valid: [
    { code: 'it(\'a test case\', () => { cy.get(\'.someClass\'); })', languageOptions },
    { code: 'it(\'a test case\', async () => { await somethingAsync(); })', languageOptions },
    { code: 'async function nonTestFn () { return await somethingAsync(); }', languageOptions },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }', languageOptions },
  ],
  invalid: [
    { code: 'it(\'a test case\', async () => { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'test(\'a test case\', async () => { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'it(\'a test case\', async function () { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'test(\'a test case\', async function () { cy.get(\'.someClass\'); })', languageOptions, errors },
  ],
})
