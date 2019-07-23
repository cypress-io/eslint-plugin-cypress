/**
 * @fileoverview Prevent use of exclusive tests (i.e. .only())
 * @author Rory Haddon
 */
'use strict'

const rule = require('../../../lib/rules/no-exclusive-tests')
const RuleTester = require('eslint').RuleTester
const ruleTester = new RuleTester()
const parserOptions = { ecmaVersion: 6 }
const errors = [{ messageId: 'exclusiveTest' }]

ruleTester.run('no-exclusive-tests', rule, {

  valid: [
    { code: 'it()', parserOptions },
    { code: 'context()', parserOptions },
    { code: 'describe()', parserOptions },
  ],

  invalid: [
    { code: 'it.only()', parserOptions, errors },
    { code: 'it["only"]()', parserOptions, errors },
    { code: 'context.only()', parserOptions, errors },
    { code: 'context["only"]()', parserOptions, errors },
    { code: 'describe.only()', parserOptions, errors },
    { code: 'describe["only"]()', parserOptions, errors },
  ],
})
