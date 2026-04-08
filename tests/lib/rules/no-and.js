'use strict'

const rule = require('../../../lib/rules/no-and'),
  RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-starting-and', rule, {
  valid: [
    { code: 'cy.get(\'elem\').should(\'have.text\', \'blah\')' },
    { code: 'cy.get(\'foo\').should(\'be.visible\')' },
    { code: 'cy.get(\'foo\').should(\'be.visible\').should(\'have.text\', \'bar\')' },
    { code: 'cy.get(\'foo\').find(\'.bar\').should(\'have.class\', \'active\')' },
    { code: 'someOtherLib.and(\'something\')' },
    { code: 'someOtherLib.get(\'foo\').and(\'be.visible\')' },
    { code: 'expect(foo).to.equal(true).and(\'have.text\', \'bar\')' },
    { code: 'cy.get(\'.err\').should(\'be.empty\').and(\'be.hidden\')' },
    { code: 'cy.get(\'foo\').should(\'be.visible\').and(\'have.text\', \'bar\')' },
    { code: 'cy.get(\'foo\').should(\'be.visible\').and(\'have.text\', \'bar\').and(\'have.class\', \'active\')' },
    { code: 'cy.contains(\'Login\').and(\'be.visible\')' },
    { code: 'cy.contains(\'Submit\').and(\'be.disabled\')' },
    { code: 'cy.contains(\'Login\').should(\'be.visible\').and(\'have.class\', \'active\')' },
    { code: 'cy.get(\'foo\').should(($el) => { expect($el).to.have.length(1) }).and(\'be.visible\')' },
    { code: 'cy.contains(\'.nav\', \'Home\').and(\'have.class\', \'active\')' },
    { code: 'cy.contains(\'Save\').should(\'not.be.disabled\').and(\'be.visible\')' },
  ],

  invalid: [
    {
      code: 'cy.and(\'be.visible\')',
      output: 'cy.should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'elem\').and(\'have.text\', \'blah\')',
      output: 'cy.get(\'elem\').should(\'have.text\', \'blah\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').and(\'be.visible\')',
      output: 'cy.get(\'foo\').should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').find(\'.bar\').and(\'have.class\', \'active\')',
      output: 'cy.get(\'foo\').find(\'.bar\').should(\'have.class\', \'active\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').click().and(\'be.disabled\')',
      output: 'cy.get(\'foo\').click().should(\'be.disabled\')',
      errors,
    },
    {
      code: 'cy.get(\'input\').invoke(\'val\').and(\'eq\', \'hello\')',
      output: 'cy.get(\'input\').invoke(\'val\').should(\'eq\', \'hello\')',
      errors,
    },
    {
      code: 'cy.get(\'foo\').then(($el) => {}).and(\'be.visible\')',
      output: 'cy.get(\'foo\').then(($el) => {}).should(\'be.visible\')',
      errors,
    },
    {
      code: 'cy.get(\'.container\').within(() => { cy.get(\'.item\').and(\'be.visible\') })',
      output: 'cy.get(\'.container\').within(() => { cy.get(\'.item\').should(\'be.visible\') })',
      errors,
    },
    {
      code: 'cy.get(\'input\').type(\'bar\').and(\'have.value\', \'bar\')',
      output: 'cy.get(\'input\').type(\'bar\').should(\'have.value\', \'bar\')',
      errors,
    },
    {
      code: 'cy.get(\'input\').check().and(\'be.checked\')',
      output: 'cy.get(\'input\').check().should(\'be.checked\')',
      errors,
    },
    {
      code: 'cy.get(\'select\').select(\'option\').and(\'have.value\', \'option\')',
      output: 'cy.get(\'select\').select(\'option\').should(\'have.value\', \'option\')',
      errors,
    },
    {
      code: 'cy.wrap(obj).and(\'deep.equal\', expected)',
      output: 'cy.wrap(obj).should(\'deep.equal\', expected)',
      errors,
    },
    {
      code: 'cy.get(\'foo\').its(\'length\').and(\'eq\', 3)',
      output: 'cy.get(\'foo\').its(\'length\').should(\'eq\', 3)',
      errors,
    },
    {
      code: 'cy.get(\'foo\').and(\'be.visible\').and(\'have.text\', \'bar\')',
      output: 'cy.get(\'foo\').should(\'be.visible\').and(\'have.text\', \'bar\')',
      errors,
    },
  ],
})
