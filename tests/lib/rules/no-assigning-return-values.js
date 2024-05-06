'use strict'

const rule = require('../../../lib/rules/no-assigning-return-values')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 6 }

ruleTester.run('no-assigning-return-values', rule, {
  valid: [
    { code: 'var foo = true;', languageOptions },
    { code: 'let foo = true;', languageOptions },
    { code: 'const foo = true;', languageOptions },
    { code: 'const foo = bar();', languageOptions },
    { code: 'const foo = bar().baz();', languageOptions },
    { code: 'const spy = cy.spy();', languageOptions },
    { code: 'const spy = cy.spy().as();', languageOptions },
    { code: 'const stub = cy.stub();', languageOptions },
    { code: 'const result = cy.now();', languageOptions },
    { code: 'const state = cy.state();', languageOptions },
    { code: 'cy.get("foo");', languageOptions },
    { code: 'cy.contains("foo").click();', languageOptions },
  ],

  invalid: [
    { code: 'let a = cy.get("foo")', languageOptions, errors },
    { code: 'const a = cy.get("foo")', languageOptions, errors },
    { code: 'var a = cy.get("foo")', languageOptions, errors },

    { code: 'let a = cy.contains("foo")', languageOptions, errors },
    { code: 'let a = cy.window()', languageOptions, errors },
    { code: 'let a = cy.wait("@something")', languageOptions, errors },

    { code: 'let a = cy.contains("foo").click()', languageOptions, errors },
  ],
})
