'use strict'

const rule = require('../../../lib/rules/no-async-before')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
// async functions are an ES2017 feature
const languageOptions = { ecmaVersion: 8 }

ruleTester.run('no-async-before', rule, {
  valid: [
    { code: 'before(\'a before case\', () => { cy.get(\'.someClass\'); })', languageOptions },
    { code: 'before(\'a before case\', async () => { await somethingAsync(); })', languageOptions },
    { code: 'async function nonTestFn () { return await somethingAsync(); }', languageOptions },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }', languageOptions },
  ],
  invalid: [
    { code: 'before(\'a test case\', async () => { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'beforeEach(\'a test case\', async () => { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'before(\'a test case\', async function () { cy.get(\'.someClass\'); })', languageOptions, errors },
    { code: 'beforeEach(\'a test case\', async function () { cy.get(\'.someClass\'); })', languageOptions, errors },
  ],
})
