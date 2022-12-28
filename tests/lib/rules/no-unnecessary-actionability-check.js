'use strict'

const rule = require('../../../lib/rules/no-unnecessary-actionability-check')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-unnecessary-actionability-check', rule, {
  valid: [
    { code: 'cy.get("button").click();', parserOptions },
    { code: 'cy.get("button").should("be.visible").click({ force: true });', parserOptions, errors },
  ],
  invalid: [
    { code: 'cy.get("button").should("be.visible").click();', parserOptions, errors },
    { code: 'cy.get("button").should("be.visible").click({ force: false });', parserOptions, errors },
    { code: 'cy.get("button").should("be.visible").should("have.class", "my-class").click();', parserOptions, errors },
    { code: 'const assertionString="be.visible"; cy.get("button").should(assertionString).click();', parserOptions, errors },
  ],
})
