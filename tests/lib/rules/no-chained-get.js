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
  ],
})
