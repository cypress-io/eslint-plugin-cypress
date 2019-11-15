'use strict'

const rule = require('../../../lib/rules/no-arrow-functions-for-hooks')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-arrow-functions-for-hooks', rule, {
  valid: [
    { code: 'describe("foo", function() {})', parserOptions },
    { code: 'context("foo", function() {})', parserOptions },
    { code: 'it("foo", function() {})', parserOptions },
    { code: 'it.skip("foo", function() {})', parserOptions },
    { code: 'it.only("foo", function() {})', parserOptions },
    { code: 'specify("foo", function() {})', parserOptions },
    { code: 'specify.skip("foo", function() {})', parserOptions },
    { code: 'specify.only("foo", function() {})', parserOptions },
    { code: 'before(function() {})', parserOptions },
    { code: 'beforeEach(function() {})', parserOptions },
    { code: 'after(function() {})', parserOptions },
    { code: 'afterEach(function() {})', parserOptions },
  ],

  invalid: [
    { code: 'describe("foo", () => {})', parserOptions, errors },
    { code: 'context("foo", () => {})', parserOptions, errors },
    { code: 'it("foo", () => {})', parserOptions, errors },
    { code: 'it.skip("foo", () => {})', parserOptions, errors },
    { code: 'it.only("foo", () => {})', parserOptions, errors },
    { code: 'specify("foo", () => {})', parserOptions, errors },
    { code: 'specify.skip("foo", () => {})', parserOptions, errors },
    { code: 'specify.only("foo", () => {})', parserOptions, errors },
    { code: 'before(() => {})', parserOptions, errors },
    { code: 'beforeEach(() => {})', parserOptions, errors },
    { code: 'after(() => {})', parserOptions, errors },
    { code: 'afterEach(() => {})', parserOptions, errors },
  ],
})
