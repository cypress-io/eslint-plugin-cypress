'use strict'

const rule = require('../../../lib/rules/no-async-before')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-async-before', rule, {
  valid: [
    { code: 'before(\'a before case\', () => { cy.get(\'.someClass\'); })' },
    { code: 'before(\'a before case\', async () => { await somethingAsync(); })' },
    { code: 'before(() => { cy.get(\'.someClass\'); })' },
    { code: 'beforeEach(() => { cy.get(\'.someClass\'); })' },
    { code: 'before(async () => { await somethingAsync(); })' },
    { code: 'beforeEach(async () => { await somethingAsync(); })' },
    { code: 'async function nonTestFn () { return await somethingAsync(); }' },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }' },
  ],
  invalid: [
    { code: 'before(async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'before(async function () { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(async function () { cy.get(\'.someClass\'); })', errors },
    { code: 'before(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(\'a test case\', async () => { cy.get(\'.someClass\'); })', errors },
    { code: 'before(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
    { code: 'beforeEach(\'a test case\', async function () { cy.get(\'.someClass\'); })', errors },
  ],
})
