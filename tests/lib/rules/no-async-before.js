'use strict'

const rule = require('../../../lib/rules/no-async-before')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
// async functions are an ES2017 feature
const parserOptions = { ecmaVersion: 8 }

ruleTester.run('no-async-before', rule, {
  valid: [
    { code: 'before(\'a before case\', () => { cy.get(\'.someClass\'); })', parserOptions },
    { code: 'before(\'a before case\', async () => { await somethingAsync(); })', parserOptions },
    { code: 'async function nonTestFn () { return await somethingAsync(); }', parserOptions },
    { code: 'const nonTestArrowFn = async () => { await somethingAsync(); }', parserOptions },
  ],
  invalid: [
    { code: 'before(\'a test case\', async () => { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'beforeEach(\'a test case\', async () => { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'before(\'a test case\', async function () { cy.get(\'.someClass\'); })', parserOptions, errors },
    { code: 'beforeEach(\'a test case\', async function () { cy.get(\'.someClass\'); })', parserOptions, errors },
  ],
})
