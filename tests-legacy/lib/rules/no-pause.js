'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-pause')

const RuleTester = require('eslint').RuleTester

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 2018 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-pause', rule, {

  valid: [
    { code: `pause()`, parserOptions },
    { code: `cy.get('button').dblclick()`, parserOptions },
  ],
  
  invalid: [
    { code: `cy.pause()`, parserOptions, errors },
    { code: `cy.pause({ log: false })`, parserOptions, errors },
    { code: `cy.get('button').pause()`, parserOptions, errors },
    { 
      code: `cy.get('a').should('have.attr', 'href').and('match', /dashboard/).pause()`, 
      parserOptions, 
      errors 
    }
  ],
})
