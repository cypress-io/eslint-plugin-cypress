'use strict'

const rule = require('../../../lib/rules/no-cypress-on-in-each-or-test')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

ruleTester.run('no-cypress-on-in-each-or-test', rule, {
  valid: [
    { code: 'Cypress.on(\'uncaught:exception\', () => false)' },
    {
      code: `before(() => {
        Cypress.on('uncaught:exception', () => false)
      })`,
    },
    {
      code: `after(() => {
        Cypress.once('uncaught:exception', () => false)
      })`,
    },
    {
      code: `describe('s', () => {
        before(function () {
          Cypress.on('uncaught:exception', () => false)
        })
      })`,
    },
  ],
  invalid: [
    {
      code: `beforeEach(function () {
        Cypress.on('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inEachHook' }],
    },
    {
      code: `afterEach(() => {
        Cypress.once('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inEachHook' }],
    },
    {
      code: `it('t', () => {
        Cypress.on('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inTestBlock' }],
    },
    {
      code: `test('t', () => {
        Cypress.on('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inTestBlock' }],
    },
    {
      code: `it.only('t', () => {
        Cypress.on('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inTestBlock' }],
    },
    {
      code: `specify('t', () => {
        Cypress.once('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inTestBlock' }],
    },
    {
      code: `test.skip('t', () => {
        Cypress.on('uncaught:exception', () => false)
      })`,
      errors: [{ messageId: 'inTestBlock' }],
    },
  ],
})
