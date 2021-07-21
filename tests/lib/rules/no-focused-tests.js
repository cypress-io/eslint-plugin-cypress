/**
 * @fileoverview Disallow focused tests
 * @author Jonathan Chaffer
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require('../../../lib/rules/no-focused-tests')

let RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-focused-tests', rule, {

  valid: [
    { code: 'it(() => {});', parserOptions },
    { code: 'describe(() => {});', parserOptions },
    { code: `describe((\'my describe block\'), () => {
            it(\'works\', () => {});
        });`, parserOptions },
    { code: '\'it.only(() => {})\'', parserOptions },
  ],

  invalid: [
    { code: 'it.only(() => {});', parserOptions, errors },
    { code: 'describe.only(() => {});', parserOptions, errors },
    { code: `describe.only((\'my describe block\'), () => {
            it(\'works\', () => {});
        });`, parserOptions, errors },
    { code: `describe((\'my describe block\'), () => {
            it.only(\'works\', () => {});
        });`, parserOptions, errors },
  ],
})
