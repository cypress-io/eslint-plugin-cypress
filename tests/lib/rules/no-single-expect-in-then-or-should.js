/**
 * @fileoverview Simplify tests by avoiding lonely expect()
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-single-expect-in-then-or-should')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const MESSAGE_THEN = 'A single expect() in a then() can be rewritten with a should().'
const MESSAGE_SHOULD = 'A single expect() in a should() can be rewritten with just a should().'

const thenError = { message: MESSAGE_THEN, type: 'CallExpression' }
const shouldError = { message: MESSAGE_SHOULD, type: 'CallExpression' }

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } })

ruleTester.run('no-single-expect-in-then-or-should', rule, {
  valid: [
    'this.f()',
    'cy.then(() => {expect()})',
    'then((foo) => {expect(foo).to.be.true})',
    'this.then(() => {expect(); expect();})',
    'this.then(() => {f();})',
    'this.then(() => {f().expect();})',
    'cy.then((foo) => {expect(bar).to.be.true})',
    'cy.should((foo) => {expect(bar).to.be.true})',
  ],

  invalid: [
    {
      code: 'cy.then((foo) => {expect(foo).to.be.true})',
      errors: [thenError],
      output: 'cy.should("be.true")',
    },
    {
      code: 'cy.should((foo) => {expect(foo).to.be.true})',
      errors: [shouldError],
      output: 'cy.should("be.true")',
    },
    {
      code: 'cy.foo().bar().then((val) => {expect(val).to.have.length(1)})',
      errors: [thenError],
      output: 'cy.foo().bar().should("have.length", 1)',
    },
    {
      code: 'cy.bar().then((val) => {expect(val).not.to.have.attr("checked")})',
      errors: [thenError],
      output: 'cy.bar().should("not.have.attr", "checked")',
    },
    {
      code: 'cy.then((url) => {expect(url).match("checked")})',
      errors: [thenError],
      output: 'cy.should("match", "checked")',
    },
    {
      code: 'cy.then(($a) => {expect($a) .to.have.attr("href")})',
      errors: [thenError],
      output: 'cy.should("have.attr", "href")',
    },
  ],
})
