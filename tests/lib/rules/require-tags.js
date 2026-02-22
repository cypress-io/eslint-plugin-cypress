'use strict'

const rule = require('../../../lib/rules/require-tags'),
  RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-tags', rule, {
  valid: [
    { code: 'it(\'should login successfully\', { tags: \'@smoke\' }, () => { cy.get(\'button\').click(); })' },
    { code: 'it(\'should handle errors\', { tags: [\'@smoke\', \'@critical\'] }, () => { expect(true).to.be.true })' },
    { code: 'specify(\'test\', { tags: [\'@smoke\'] }, () => { cy.get(\'button\').click(); })' },
    { code: 'context(\'suite\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'describe(\'User Management\', { tags: \'@user\' }, () => { it(\'should create user\', { tags: \'@user\' }, () => {}); })' },
    { code: 'it.only(\'test\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'it.skip(\'test\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'specify.only(\'test\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'specify.skip(\'test\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'describe.only(\'suite\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'describe.skip(\'suite\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'context.only(\'suite\', { tags: [\'@smoke\'] }, () => {})' },
    { code: 'context.skip(\'suite\', { tags: [\'@smoke\'] }, () => {})' },
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
      code: 'it(\'test\', { tags: \'\' }, () => { cy.get(\'button\').click(); })',
      errors: [{ messageId: 'emptyTags' }],
    },
    {
      code: 'it(\'test\', { tags: [\'\'] }, () => { cy.get(\'button\').click(); })',
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
    {
      code: 'describe(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'describe(\'suite\', { tags: [] }, () => {})',
      errors: [{ messageId: 'emptyTags' }],
    },
    {
      code: 'context(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'context(\'suite\', { tags: [] }, () => {})',
      errors: [{ messageId: 'emptyTags' }],
    },
    {
      code: 'describe.only(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'describe.skip(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'context.only(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: 'context.skip(\'suite\', () => {})',
      errors: [{ messageId: 'missingTags' }],
    },
  ],
})
