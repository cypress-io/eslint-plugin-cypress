'use strict'

const rule = require('../../../lib/rules/no-assigning-return-values')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-assigning-return-values', rule, {
  valid: [
    { code: 'var foo = true;' },
    { code: 'let foo = true;' },
    { code: 'const foo = true;' },
    { code: 'const foo = bar();' },
    { code: 'const foo = bar().baz();' },
    { code: 'const spy = cy.spy();' },
    { code: 'const spy = cy.spy().as();' },
    { code: 'const stub = cy.stub();' },
    { code: 'const result = cy.now();' },
    { code: 'const state = cy.state();' },
    { code: 'cy.get("foo");' },
    { code: 'cy.contains("foo").click();' },
    { code: 'const foo = cond ? 1 : 2;' },
    { code: 'const foo = cond ? bar() : baz();' },
    { code: 'const stub = cond ? cy.stub() : cy.stub();' },
    { code: 'const spy = cond ? cy.spy() : bar();' },
  ],

  invalid: [
    { code: 'let a = cy.get("foo")', errors },
    { code: 'const a = cy.get("foo")', errors },
    { code: 'var a = cy.get("foo")', errors },

    { code: 'let a = cy.contains("foo")', errors },
    { code: 'let a = cy.window()', errors },
    { code: 'let a = cy.wait("@something")', errors },

    { code: 'let a = cy.contains("foo").click()', errors },
    { code: 'const a = cond ? cy.get("foo") : cy.get("bar")', errors },
    { code: 'const a = cond ? cy.get("foo") : bar()', errors },
    { code: 'const a = bar() ? cy.contains("foo") : cy.window()', errors },
    { code: 'const a = cond ? (other ? cy.get("foo") : bar()) : baz()', errors },
  ],
})
