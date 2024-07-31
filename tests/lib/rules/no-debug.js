'use strict'

const rule = require('../../../lib/rules/no-debug')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-debug', rule, {

  valid: [
    { code: `debug()` },
    { code: `cy.get('button').dblclick()` },
  ],

  invalid: [
    { code: `cy.debug()`, errors },
    { code: `cy.debug({ log: false })`, errors },
    { code: `cy.get('button').debug()`, errors },
    { code: `cy.get('a').should('have.attr', 'href').and('match', /dashboard/).debug()`, errors }
  ],
})
