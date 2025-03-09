/**
 * @fileoverview disallow chain of `cy.get()` calls
 * @author benoit
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-chained-get"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-chained-get", rule, {
  valid: [
    { code: "cy.get('div')" },
    { code: "cy.get('.div').find().get()" },
    { code: "cy.get('input').should('be.disabled')" },
  ],
  invalid: [
    {
      code: "cy.get('div').get('div')",
      errors: [{ messageId: "unexpected" }],
    },
  ],
});
