'use strict'

const rule = require('../../../lib/rules/require-tags'),
  RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-tags', rule, {
  valid: [
    { code: 'it(\'test\', { tags: [\'smoke\'] }, () => { cy.get(\'button\').click(); })' },

    { code: 'it(\'works as an array\', { tags: [\'config\', \'some-other-tag\'] }, () => { expect(true).to.be.true })' },
  ],

  invalid: [
    {
      code: 'it(\'test\', () => { expect(true).to.be.true })',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'it(\'test\', { tags: [] }, () => { cy.get(\'button\').click(); })',
      errors: [{ messageId: 'emptyTags' }],
    },
  ],
})
