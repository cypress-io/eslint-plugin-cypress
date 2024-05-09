'use strict'

const rule = require('../../../lib/rules/no-async-before')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-async-before', rule, {
  valid: [
    { code: 'before(\'a before case\', () => { cy.get(\'.someClass\'); })' },
    { code: 'before(\'a before case\', async () => { await somethingAsync(); })' },
    { code: 'async function nonTestFn () { return await somethingAsync(); }' },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }' },
  ],
  invalid: [
    { code: 'before(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'before(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
  ],
})
