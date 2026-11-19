/**
 * @fileoverview disallow chain of `cy.get()` calls
 * @author benoit
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-chained-get'),
  RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-chained-get', rule, {
  valid: [
    { code: 'cy.get(\'div\')' },
    { code: 'cy.get(\'input\').should(\'be.disabled\')' },
    { code: 'cy.get(\'.div\').find(\'span\').click()' },
    { code: 'cy.log(\'test\').get(\'.selector\')' },
    { code: 'cy.visit(\'/\').get(\'.selector\')' },
    { code: 'foo.get(\'a\').find(\'b\').get(\'c\')' },
    { code: 'cy.get(\'button\').click().get(\'@postUser\')' },
    { code: 'cy.get(\'a\').get(\'@alias\')' },
    { code: 'cy.get(\'a\').get(`@${name}`)' },
    { code: 'cy.get(\'form\').within(() => { cy.get(\'input\') })' },
    { code: 'cy.get(\'a\').then(() => cy.get(\'b\'))' },
  ],
  invalid: [
    {
      code: 'cy.get(\'div\').get(\'div\')',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'cy.get(\'.div\').find(\'span\').get(\'p\')',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'cy.get(\'selector\').find(\'childSelector\').first().get(\'anotherSelector\')',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'cy.get(\'selector\').should(\'not.exist\').get(\'anotherSelector\')',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'cy.log(\'test\').get(\'a\').click().get(\'b\')',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'cy.get(\'a\').get(\'b\').find(\'c\').get(\'d\')',
      errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }],
    },
    {
      code: 'cy.get(\'@alias\').find(\'span\').get(\'p\')',
      errors: [{ messageId: 'unexpected' }],
    },
  ],
})
