/**
 * @fileoverview `.should()` and `.then()` can be removed when they only wrap commands
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-useless-then-or-should')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } })
const MESSAGE = '`.should()` and `.then()` can be removed when they only wrap commands'
const errors = [{ message: MESSAGE, type: 'CallExpression' }]

ruleTester.run('no-useless-then-or-should', rule, {
  valid: [
    'cy.then(() => f())',
    'cy.should(() => f())',
    'cy.should((foo) => cy.get(foo))',
    'cy.should(() => {cy.get("foo"); f();})',
    'cy.f().should(() => g())',
  ],

  invalid: [
    {
      code: 'cy.then(() => cy.get("foo"))',
      errors,
      output: 'cy.get("foo")',
    },
    {
      code: 'cy.should(() => {cy.get("@stub").should("have.been.called");})',
      errors,
      output: 'cy.get("@stub").should("have.been.called");',
    },
    {
      code: 'cy.f().then(() => cy.get("foo"))',
      errors,
      output: 'cy.f();cy.get("foo")',
    },
    {
      code: 'cy.f().then(() => {cy.get("foo"); cy.get("bar");})',
      errors,
      output: 'cy.f();cy.get("foo"); cy.get("bar");',
    },
    {
      code: 'cy.then(() => {\n// some comment\ncy.get(\'foo\');\n})',
      errors,
      output: '// some comment\ncy.get(\'foo\');',
    },
  ],
})
