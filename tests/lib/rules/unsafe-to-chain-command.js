'use strict'

const rule = require('../../../lib/rules/unsafe-to-chain-command')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 6 }

ruleTester.run('action-ends-chain', rule, {
  valid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}"); cy.get("new-todo").type("todo B{enter}"); cy.get("new-todo").should("have.class", "active");',
      languageOptions,
    },
    {
      code: 'cy.focused().should("be.visible");',
      languageOptions,
    },
    {
      code: 'cy.submitBtn().click();',
      languageOptions,
    },
  ],

  invalid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}").should("have.class", "active");',
      languageOptions,
      errors,
    },
    {
      code: 'cy.get("new-todo").type("todo A{enter}").type("todo B{enter}");',
      languageOptions,
      errors,
    },
    {
      code: 'cy.get("new-todo").focus().should("have.class", "active");',
      languageOptions,
      errors,
    },
    {
      code: 'cy.get("new-todo").customType("todo A{enter}").customClick();',
      languageOptions,
      errors,
      options: [{ methods: ['customType', 'customClick'] }],
    },
    {
      code: 'cy.get("new-todo").customPress("Enter").customScroll();',
      languageOptions,
      errors,
      options: [{ methods: ['customPress', 'customScroll'] }],
    },
  ],
})
