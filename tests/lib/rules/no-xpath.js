"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-xpath"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-xpath", rule, {
  valid: [
    { code: 'cy.get("button").click({force: true})' },
  ],

  invalid: [
    {
      code: "cy.xpath('//div[@class=\"container\"]/p[1]').click()",
      errors: [{ messageId: "unexpected" }],
    },
    {
      code: "cy.xpath('//p[1]').should('exist')",
      errors: [{ messageId: "unexpected" }]
    }
  ],
});
