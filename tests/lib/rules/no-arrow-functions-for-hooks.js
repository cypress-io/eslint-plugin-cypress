'use strict'

const rule = require('../../../lib/rules/no-arrow-functions-for-hooks')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-arrow-functions-for-hooks', rule, {
  valid: [
    // basic usage for every hooks
    // { code: 'describe("foo", function() { this.skip(); })', parserOptions },
    // { code: 'describe("foo", function() {})', parserOptions },
    // { code: 'describe("foo", () => {})', parserOptions },
    // { code: 'context("foo", function() { this.skip(); })', parserOptions },
    // { code: 'context("foo", function() {})', parserOptions },
    // { code: 'context("foo", () => {})', parserOptions },
    // { code: 'it("foo", function() { this.skip(); })', parserOptions },
    // { code: 'it("foo", function() {})', parserOptions },
    // { code: 'it("foo", () => {})', parserOptions },
    // { code: 'it.skip("foo", function() { this.skip(); })', parserOptions },
    // { code: 'it.skip("foo", function() {})', parserOptions },
    // { code: 'it.skip("foo", () => {})', parserOptions },
    // { code: 'it.only("foo", function() { this.skip(); })', parserOptions },
    // { code: 'it.only("foo", function() {})', parserOptions },
    // { code: 'it.only("foo", () => {})', parserOptions },
    // { code: 'specify("foo", function() { this.skip(); })', parserOptions },
    // { code: 'specify("foo", function() {})', parserOptions },
    // { code: 'specify("foo", () => {})', parserOptions },
    // { code: 'specify.skip("foo", function() { this.skip(); })', parserOptions },
    // { code: 'specify.skip("foo", function() {})', parserOptions },
    // { code: 'specify.skip("foo", () => {})', parserOptions },
    // { code: 'specify.only("foo", function() { this.skip(); })', parserOptions },
    // { code: 'specify.only("foo", function() {})', parserOptions },
    // { code: 'specify.only("foo", () => {})', parserOptions },
    // { code: 'before(function() { this.skip(); })', parserOptions },
    // { code: 'before(function() {})', parserOptions },
    // { code: 'before(() => {})', parserOptions },
    // { code: 'beforeEach(function() { this.skip(); })', parserOptions },
    // { code: 'beforeEach(function() {})', parserOptions },
    // { code: 'beforeEach(() => {})', parserOptions },
    // { code: 'after(function() { this.skip(); })', parserOptions },
    // { code: 'after(function() {})', parserOptions },
    // { code: 'after(() => {})', parserOptions },
    // { code: 'afterEach(function() { this.skip(); })', parserOptions },
    // { code: 'afterEach(function() {})', parserOptions },
    // { code: 'afterEach(() => {})', parserOptions },

    { code: 'afterEach(function() { foo(() => this.skip()); })', parserOptions },
    // { code: 'afterEach(function() { foo(function() { this.skip(); }); })', parserOptions },
  ],

  invalid: [
    // { code: 'describe("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'context("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'it("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'it.skip("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'it.only("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'specify("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'specify.skip("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'specify.only("foo", () => { this.skip() })', parserOptions, errors },
    // { code: 'before(() => { this.skip() })', parserOptions, errors },
    // { code: 'beforeEach(() => { this.skip() })', parserOptions, errors },
    // { code: 'after(() => { this.skip() })', parserOptions, errors },
    // { code: 'afterEach(() => { this.skip() })', parserOptions, errors },
  ],
})
