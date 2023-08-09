'use strict'

const rule = require('../../../../lib/rules/unsafe-to-chain-command')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

/**
 * The `name` property does not exist on {@link RuleTester.ValidTestCase} or {@link RuleTester.InvalidTestCase}
 * in ESLint 5.7.0, so we cannot provide clearer test descriptions.
 */
ruleTester.run('action-ends-chain', rule, {
  valid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}"); cy.get("new-todo").type("todo B{enter}"); cy.get("new-todo").should("have.class", "active");',
      parserOptions,
    },
    {
      // It should do an exact match.
      code: 'cy.get("new-todo").customHover1("Enter").customHover2();',
      parserOptions,
      options: [{ methods: ['customHover'] }],
    },
  ],
  invalid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}").should("have.class", "active");',
      parserOptions,
      errors,
    },
    {
      code: 'cy.get("new-todo").type("todo A{enter}").type("todo B{enter}");',
      parserOptions,
      errors,
    },
    {
      code: 'cy.get("new-todo").customType("todo A{enter}").customClick();',
      parserOptions,
      errors,
      options: [{ methods: ['customType', 'customClick'] }],
    },
    // It should allow wildcard matching.
    {
      code: 'cy.get("new-todo").customLongClick("Enter").customShortClick();',
      parserOptions,
      errors,
      options: [{ methods: ['custom*Click'] }],
    },
    {
      code: 'cy.get("new-todo").customClick1("Enter").customClick2();',
      parserOptions,
      errors,
      options: [{ methods: ['customClick*'] }],
    },
    // It should allow matching with braces.
    {
      code: 'cy.get("new-todo").customLongClick("Enter").customDblClick();',
      parserOptions,
      errors,
      options: [{ methods: ['custom{Long,Dbl}Click'] }],
    },
    {
      // It should not allow negations for default Cypress commands.
      code: 'cy.get("new-todo").dblclick("Enter");',
      parserOptions,
      errors,
      options: [{ methods: ['!dblclick'] }],
    },
  ],
})
