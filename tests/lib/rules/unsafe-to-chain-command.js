'use strict'

const rule = require('../../../lib/rules/unsafe-to-chain-command')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('action-ends-chain', rule, {
  valid: [
    { code: 'cy.get("new-todo").type("todo A{enter}"); cy.get("new-todo").type("todo B{enter}"); cy.get("new-todo").should("have.class", "active");', parserOptions },
  ],

  invalid: [
    { code: 'cy.get("new-todo").type("todo A{enter}").should("have.class", "active");', parserOptions, errors },
    { code: 'cy.get("new-todo").type("todo A{enter}").type("todo B{enter}");', parserOptions, errors },
  ],
})
