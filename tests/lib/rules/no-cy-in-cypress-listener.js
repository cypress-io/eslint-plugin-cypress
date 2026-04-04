'use strict'

const rule = require('../../../lib/rules/no-cy-in-cypress-listener')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'noCyInListener' }]

ruleTester.run('no-cy-in-cypress-listener', rule, {
  valid: [
    { code: 'Cypress.on(\'uncaught:exception\', () => { return false })' },
    { code: 'Cypress.once(\'test:before:run\', () => { console.log(1) })' },
    { code: 'cy.on(\'window:before:load\', (win) => { cy.stub(win, \'open\') })' },
    {
      code: `it('x', () => {
        cy.get('.a')
        Cypress.on('uncaught:exception', () => false)
      })`,
    },
  ],
  invalid: [
    {
      code: 'Cypress.on(\'uncaught:exception\', () => { cy.get(\'.x\') })',
      errors,
    },
    {
      code: 'Cypress.once(\'uncaught:exception\', function () { cy.wrap(1) })',
      errors,
    },
    {
      code: 'Cypress.on(\'uncaught:exception\', () => cy.get(\'.x\'))',
      errors,
    },
    {
      code: 'Cypress.on(\'uncaught:exception\', () => { cy.get(\'.a\').click() })',
      errors,
    },
    {
      code: `Cypress.on('uncaught:exception', () => {
        if (x) { cy.task('log') }
      })`,
      errors,
    },
  ],
})
