'use strict'

const rule = require('../../../lib/rules/require-tags'),
  RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-tags', rule, {
  valid: [
    { code: 'it(\'test\', { tags: [\'smoke\'] }, () => { cy.get(\'button\').click(); })' },
    { code: 'it(\'test\', { tags: [\'config\', \'some-other-tag\'] }, () => { expect(true).to.be.true })' },
    { code: 'specify(\'test\', { tags: [\'smoke\'] }, () => { cy.get(\'button\').click(); })' },
    { code: 'it.only(\'test\', { tags: [\'smoke\'] }, () => {})' },
    { code: 'it.skip(\'test\', { tags: [\'smoke\'] }, () => {})' },
    { code: 'specify.only(\'test\', { tags: [\'smoke\'] }, () => {})' },
    { code: 'specify.skip(\'test\', { tags: [\'smoke\'] }, () => {})' },
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
    {
      code: 'specify(\'test\', () => { expect(true).to.be.true })',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'it.only(\'test\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'it.skip(\'test\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'specify.only(\'test\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'specify.skip(\'test\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
  ],
})
