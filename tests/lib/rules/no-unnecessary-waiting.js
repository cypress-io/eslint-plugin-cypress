'use strict'

const rule = require('../../../lib/rules/no-unnecessary-waiting')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-unnecessary-waiting', rule, {
  valid: [
    { code: 'foo.wait(10)' },

    { code: 'cy.wait("@someRequest")' },
    { code: 'cy.wait("@someRequest", { log: false })' },
    { code: 'cy.wait("@someRequest").then((xhr) => xhr)' },
    { code: 'cy.wait(["@someRequest", "@anotherRequest"])' },

    { code: 'cy.clock(5000)' },
    { code: 'cy.scrollTo(0, 10)' },
    { code: 'cy.tick(500)' },

    { code: 'const someRequest="@someRequest"; cy.wait(someRequest)' },
    { code: 'function customWait (alias = "@someRequest") { cy.wait(alias) }' },
    { code: 'const customWait = (alias = "@someRequest") => { cy.wait(alias) }' },
    { code: 'function customWait (ms) { cy.wait(ms) }' },
    { code: 'const customWait = (ms) => { cy.wait(ms) }' },

    { code: 'import BAR_BAZ from "bar-baz"; cy.wait(BAR_BAZ)' },
    { code: 'import { FOO_BAR } from "foo-bar"; cy.wait(FOO_BAR)' },
    { code: 'import * as wildcard from "wildcard"; cy.wait(wildcard.value)' },
    { code: 'import { NAME as OTHER_NAME } from "rename"; cy.wait(OTHER_NAME)' },
  ],

  invalid: [
    { code: 'cy.wait(0)', errors },
    { code: 'cy.wait(100)', errors },
    { code: 'cy.wait(5000)', errors },
    { code: 'const someNumber=500; cy.wait(someNumber)', errors },
    { code: 'function customWait (ms = 1) { cy.wait(ms) }', errors },
    { code: 'const customWait = (ms = 1) => { cy.wait(ms) }', errors },

    { code: 'cy.get(".some-element").wait(10)', errors },
    { code: 'cy.get(".some-element").contains("foo").wait(10)', errors },
    { code: 'const customWait = (ms = 1) => { cy.get(".some-element").wait(ms) }', errors },
  ],
})
