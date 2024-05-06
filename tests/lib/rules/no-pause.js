'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-pause')

const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 2018 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new FlatRuleTester()

ruleTester.run('no-pause', rule, {

  valid: [
    { code: `pause()`, languageOptions },
    { code: `cy.get('button').dblclick()`, languageOptions },
  ],

  invalid: [
    { code: `cy.pause()`, languageOptions, errors },
    { code: `cy.pause({ log: false })`, languageOptions, errors },
    { code: `cy.get('button').pause()`, languageOptions, errors },
    {
      code: `cy.get('a').should('have.attr', 'href').and('match', /dashboard/).pause()`,
      languageOptions,
      errors
    }
  ],
})
