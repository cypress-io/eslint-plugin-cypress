'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-force')

const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 2018 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new FlatRuleTester()

ruleTester.run('no-force', rule, {

  valid: [
    { code: `cy.get('button').click()`, languageOptions },
    { code: `cy.get('button').click({multiple: true})`, languageOptions },
    { code: `cy.get('button').dblclick()`, languageOptions },
    { code: `cy.get('input').type('somth')`, languageOptions },
    { code: `cy.get('input').type('somth', {anyoption: true})`, languageOptions },
    { code: `cy.get('input').trigger('click', {anyoption: true})`, languageOptions },
    { code: `cy.get('input').rightclick({anyoption: true})`, languageOptions },
    { code: `cy.get('input').check()`, languageOptions },
    { code: `cy.get('input').select()`, languageOptions },
    { code: `cy.get('input').focus()`, languageOptions },
    { code: `cy.document().trigger("keydown", { ...event })`, languageOptions },
  ],

  invalid: [
    { code: `cy.get('button').click({force: true})`, languageOptions, errors },
    { code: `cy.get('button').dblclick({force: true})`, languageOptions, errors },
    { code: `cy.get('input').type('somth', {force: true})`, languageOptions, errors },
    { code: `cy.get('div').find('.foo').type('somth', {force: true})`, languageOptions, errors },
    { code: `cy.get('div').find('.foo').find('.bar').click({force: true})`, languageOptions, errors },
    { code: `cy.get('div').find('.foo').find('.bar').trigger('change', {force: true})`, languageOptions, errors },
    { code: `cy.get('input').trigger('click', {force: true})`, languageOptions, errors },
    { code: `cy.get('input').rightclick({force: true})`, languageOptions, errors },
    { code: `cy.get('input').check({force: true})`, languageOptions, errors },
    { code: `cy.get('input').select({force: true})`, languageOptions, errors },
    { code: `cy.get('input').focus({force: true})`, languageOptions, errors },
  ],
})
