'use strict'

const rule = require('../../../lib/rules/no-dynamic-id-classes')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-dynamic-id-classes', rule, {
  valid: [
    { code: 'cy.get(["data-qa"])', parserOptions },
    { code: 'cy.clock(5000)', parserOptions },
    { code: 'cy.scrollTo(0, 10)', parserOptions },
    { code: 'cy.tick(500)', parserOptions },
  ],

  invalid: [
    { code: 'cy.get("data-qa")', parserOptions, errors },
    { code: 'cy.get("button").click()', parserOptions, errors },
    { code: 'cy.get(".btn.btn-large").click()', parserOptions, errors },
  ],
})
