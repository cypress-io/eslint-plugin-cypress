'use strict'

const rule = require('../../../lib/rules/no-force')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-force', rule, {

  valid: [
    { code: `cy.get('button').click()` },
    { code: `cy.get('button').click({multiple: true})` },
    { code: `cy.get('button').dblclick()` },
    { code: `cy.get('input').type('somth')` },
    { code: `cy.get('input').type('somth', {anyoption: true})` },
    { code: `cy.get('input').trigger('click', {anyoption: true})` },
    { code: `cy.get('input').rightclick({anyoption: true})` },
    { code: `cy.get('input').check()` },
    { code: `cy.get('input').select()` },
    { code: `cy.get('input').focus()` },
    { code: `cy.document().trigger("keydown", { ...event })` },
  ],

  invalid: [
    { code: `cy.get('button').click({force: true})`, errors },
    { code: `cy.get('button').dblclick({force: true})`, errors },
    { code: `cy.get('input').type('somth', {force: true})`, errors },
    { code: `cy.get('div').find('.foo').type('somth', {force: true})`, errors },
    { code: `cy.get('div').find('.foo').find('.bar').click({force: true})`, errors },
    { code: `cy.get('div').find('.foo').find('.bar').trigger('change', {force: true})`, errors },
    { code: `cy.get('input').trigger('click', {force: true})`, errors },
    { code: `cy.get('input').rightclick({force: true})`, errors },
    { code: `cy.get('input').check({force: true})`, errors },
    { code: `cy.get('input').select({force: true})`, errors },
    { code: `cy.get('input').focus({force: true})`, errors },
  ],
})
