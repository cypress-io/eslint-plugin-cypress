/**
 * @fileoverview disallow the use of .and()
 * @author Todd Kemp
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-and'),
  RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-and', rule, {
  valid: [
    { code: 'cy.get(\'foo\').should(\'be.visible\')' },
    { code: 'cy.get(\'foo\').should(\'be.visible\').should(\'have.text\', \'bar\')' },
    { code: 'cy.get(\'foo\').find(\'.bar\').should(\'have.class\', \'active\')' },
    { code: 'someOtherLib.and(\'something\')' },
    { code: 'someOtherLib.get(\'foo\').and(\'be.visible\')' },
    { code: 'expect(foo).to.equal(true).and(\'have.text\', \'bar\')' },
    { code: 'someOtherLib.get(\'foo\').find(\'.bar\').filter(\'.baz\').first().and(\'be.visible\')' },
  ],

  invalid: [
    {
      code: 'cy.and(\'be.visible\')',
      output: 'cy.should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').and(\'be.visible\')',
      output: 'cy.get(\'foo\').should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').should(\'be.visible\').and(\'have.text\', \'bar\')',
      output: 'cy.get(\'foo\').should(\'be.visible\').should(\'have.text\', \'bar\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').find(\'.bar\').and(\'have.class\', \'active\')',
      output: 'cy.get(\'foo\').find(\'.bar\').should(\'have.class\', \'active\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').find(\'.bar\').filter(\'.baz\').first().and(\'be.visible\')',
      output: 'cy.get(\'foo\').find(\'.bar\').filter(\'.baz\').first().should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').find(\'.bar\').filter(\'.baz\').first().parent().siblings().eq(0).and(\'be.visible\')',
      output: 'cy.get(\'foo\').find(\'.bar\').filter(\'.baz\').first().parent().siblings().eq(0).should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'.container\').within(() => { cy.get(\'.item\').and(\'be.visible\') })',
      output: 'cy.get(\'.container\').within(() => { cy.get(\'.item\').should(\'be.visible\') })',
      errors,
    },
    {
      code: 'cy.get(\'foo\').then(($el) => { cy.wrap($el).and(\'have.class\', \'active\') })',
      output: 'cy.get(\'foo\').then(($el) => { cy.wrap($el).should(\'have.class\', \'active\') })',
      errors,
    },
    {
      code: 'cy.get(\'foo\').then(($el) => {}).and(\'be.visible\')',
      output: 'cy.get(\'foo\').then(($el) => {}).should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').as(\'myEl\').and(\'be.visible\')',
      output: 'cy.get(\'foo\').as(\'myEl\').should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').and(\'be.visible\').and(\'have.text\', \'bar\')',
      output: 'cy.get(\'foo\').should(\'be.visible\').should(\'have.text\', \'bar\')',
      errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }],
    },
    {
      code: 'cy.contains(\'Submit\').and(\'be.disabled\')',
      output: 'cy.contains(\'Submit\').should(\'be.disabled\')',
      errors,
    },
    {
      code: 'cy.get(\'input\').invoke(\'val\').and(\'eq\', \'hello\')',
      output: 'cy.get(\'input\').invoke(\'val\').should(\'eq\', \'hello\')',
      errors,
    },
  ],
})
