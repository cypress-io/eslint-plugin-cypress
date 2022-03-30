'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-duplicate-commands')

const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-duplicate-commands', rule, {
  valid: [
    { code: `
      Cypress.Commands.add("foo")
      Cypress.Commands.add("bar")
      Foo.Commands.add("foo")
      Foo.add("foo");
      Cypress.Config.add("foo")
    `,
    },
    // with the rule disabled
    { code: `
    Cypress.Commands.add("foo");
    Cypress.Commands.add("foo"); // eslint-disable-line no-duplicate-commands
    `,
    },
  ],
  invalid: [
    {
      code: `
      Cypress.Commands.add("foo");
      Cypress.Commands.add("foo");
      `,
      errors: [{ message: 'Command name is already registered: foo' }],
    },
  ],
})
