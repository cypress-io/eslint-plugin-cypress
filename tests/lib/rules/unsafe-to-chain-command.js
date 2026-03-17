'use strict'

const rule = require('../../../lib/rules/unsafe-to-chain-command')
const tsParser = require('typescript-eslint').parser
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

const tests = {
  valid: [
    {
      code: 'cy.get("new-todo").type("todo A{enter}"); cy.get("new-todo").type("todo B{enter}"); cy.get("new-todo").should("have.class", "active");',
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
}

const typedTests = {
  valid: [
    ...tests.valid,
    {
      filename: 'valid.ts',
      code: `
        /// <reference types="cypress" />
        function getTodo() {
          return cy.get("new-todo");
        }
        getTodo().type("todo A{enter}"); 
        getTodo().type("todo B{enter}");
      `,
    },
  ],

  invalid: [
    ...tests.invalid,
    {
      filename: 'invalid.ts',
      code: `
        /// <reference types="cypress" />
        function getTodo() {
          return cy.get("new-todo");
        }        
        getTodo().type("todo A{enter}").type("todo B{enter}");
      `, errors,
    },
  ],
}

ruleTester.run('action-ends-chain', rule, tests)

const typedRuleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts'],
      },
    },
  },
})

typedRuleTester.run('action-ends-chain', rule, typedTests)
