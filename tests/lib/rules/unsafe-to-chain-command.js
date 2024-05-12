'use strict'

const rule = require('../../../lib/rules/unsafe-to-chain-command')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('action-ends-chain', rule, {
  valid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}"); cy.get("new-todo").type("todo B{enter}"); cy.get("new-todo").should("have.class", "active");'
    },
    { code: 'cy.focused().should("be.visible");' },
    { code: 'cy.submitBtn().click();' },
  ],

  invalid: [
    { code: 'cy.get("new-todo").type("todo A{enter}").should("have.class", "active");', errors },
    { code: 'cy.get("new-todo").type("todo A{enter}").type("todo B{enter}");', errors },
    { code: 'cy.get("new-todo").focus().should("have.class", "active");', errors },
    {
      code: 'cy.get("new-todo").customType("todo A{enter}").customClick();',
      options: [{ methods: ['customType', 'customClick'] }],
      errors,
    },
    {
      code: 'cy.get("new-todo").customPress("Enter").customScroll();',
      options: [{ methods: ['customPress', 'customScroll'] }],
      errors,
    },
  ],
})
