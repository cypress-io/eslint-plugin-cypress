'use strict'

const rule = require('../../../lib/rules/no-unnecessary-waiting')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-unnecessary-waiting', rule, {
  valid: [
    { code: 'cy.wait("@someRequest")', parserOptions },
    { code: 'cy.wait("@someRequest", { log: false })', parserOptions },
    { code: 'cy.wait("@someRequest").then((xhr) => xhr)', parserOptions },
    { code: 'cy.wait(["@someRequest", "@anotherRequest"])', parserOptions },

    { code: 'cy.clock(5000)', parserOptions },
    { code: 'cy.scrollTo(0, 10)', parserOptions },
    { code: 'cy.tick(500)', parserOptions },

    { code: 'const someRequest="@someRequest"; cy.wait(someRequest)', parserOptions, errors },
  ],

  invalid: [
    { code: 'cy.wait(0)', parserOptions, errors },
    { code: 'cy.wait(100)', parserOptions, errors },
    { code: 'cy.wait(5000)', parserOptions, errors },
    { code: 'const someNumber=500; cy.wait(someNumber)', parserOptions, errors },
  ],
})
