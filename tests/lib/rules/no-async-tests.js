'use strict'

const rule = require('../../../lib/rules/no-async-tests')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-async-tests', rule, {
  valid: [
    { code: 'it(\'a test case\', () => { cy.get(\'.someClass\'); })' },
    { code: 'it(\'a test case\', async () => { await somethingAsync(); })' },
    { code: 'async function nonTestFn () { return await somethingAsync(); }' },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }' },
  ],
  invalid: [
    { code: 'it(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'test(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'it(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
    { code: 'test(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
  ],
})
