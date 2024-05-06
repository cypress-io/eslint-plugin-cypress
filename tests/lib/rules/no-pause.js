'use strict'

const rule = require('../../../lib/rules/no-pause')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-pause', rule, {

  valid: [
    { code: `pause()` },
    { code: `cy.get('button').dblclick()` },
  ],

  invalid: [
    { code: `cy.pause()`, errors },
    { code: `cy.pause({ log: false })`, errors },
    { code: `cy.get('button').pause()`, errors },
    { code: `cy.get('a').should('have.attr', 'href').and('match', /dashboard/).pause()`, errors }
  ],
})
