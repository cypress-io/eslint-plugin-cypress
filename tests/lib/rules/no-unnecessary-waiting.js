'use strict'

const rule = require('../../../lib/rules/no-unnecessary-waiting')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 6, sourceType: 'module' }

ruleTester.run('no-unnecessary-waiting', rule, {
  valid: [
    { code: 'foo.wait(10)', languageOptions },

    { code: 'cy.wait("@someRequest")', languageOptions },
    { code: 'cy.wait("@someRequest", { log: false })', languageOptions },
    { code: 'cy.wait("@someRequest").then((xhr) => xhr)', languageOptions },
    { code: 'cy.wait(["@someRequest", "@anotherRequest"])', languageOptions },

    { code: 'cy.clock(5000)', languageOptions },
    { code: 'cy.scrollTo(0, 10)', languageOptions },
    { code: 'cy.tick(500)', languageOptions },

    { code: 'const someRequest="@someRequest"; cy.wait(someRequest)', languageOptions, errors },
    { code: 'function customWait (alias = "@someRequest") { cy.wait(alias) }', languageOptions, errors },
    { code: 'const customWait = (alias = "@someRequest") => { cy.wait(alias) }', languageOptions, errors },
    { code: 'function customWait (ms) { cy.wait(ms) }', languageOptions, errors },
    { code: 'const customWait = (ms) => { cy.wait(ms) }', languageOptions, errors },

    { code: 'import BAR_BAZ from "bar-baz"; cy.wait(BAR_BAZ)', languageOptions },
    { code: 'import { FOO_BAR } from "foo-bar"; cy.wait(FOO_BAR)', languageOptions },
    { code: 'import * as wildcard from "wildcard"; cy.wait(wildcard.value)', languageOptions },
    { code: 'import { NAME as OTHER_NAME } from "rename"; cy.wait(OTHER_NAME)', languageOptions },
  ],

  invalid: [
    { code: 'cy.wait(0)', languageOptions, errors },
    { code: 'cy.wait(100)', languageOptions, errors },
    { code: 'cy.wait(5000)', languageOptions, errors },
    { code: 'const someNumber=500; cy.wait(someNumber)', languageOptions, errors },
    { code: 'function customWait (ms = 1) { cy.wait(ms) }', languageOptions, errors },
    { code: 'const customWait = (ms = 1) => { cy.wait(ms) }', languageOptions, errors },

    { code: 'cy.get(".some-element").wait(10)', languageOptions, errors },
    { code: 'cy.get(".some-element").contains("foo").wait(10)', languageOptions, errors },
    { code: 'const customWait = (ms = 1) => { cy.get(".some-element").wait(ms) }', languageOptions, errors },
  ],
})
