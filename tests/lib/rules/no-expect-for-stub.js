/**
 * @fileoverview Use cy.get("@stub").should(…) instead of expect(stub)…
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-expect-for-stub')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-expect-for-stub', rule, {
  valid: [
    'cy.get("@stub").should.have.been.calledOnce',
    'cy.get("@stub").should.have.been.calledWith(value1,value2)',
    'expect(val).to.be.true',
    'main()',
  ],

  invalid: [
    {
      code: 'expect(stub).to.have.been.calledOnce',
      errors: [{ messageId: 'message', type: 'MemberExpression' }],
      output: 'cy.get("@stub").should("have.been.calledOnce")',
    },
    {
      code: 'expect(getCellContentClickedCallback).to.have.been\n.calledTwice',
      errors: [{ messageId: 'message', type: 'MemberExpression' }],
      output: 'cy.get("@getCellContentClickedCallback").should("have.been.calledTwice")',
    },
    {
      code: 'expect(stub).to.be.calledWith(value)',
      errors: [{ messageId: 'message', type: 'CallExpression' }],
      output: 'cy.get("@stub").should("be.calledWith", value)',
    },
    {
      code: 'expect(stub).to.be.calledWith()',
      errors: [{ messageId: 'message', type: 'CallExpression' }],
      output: 'cy.get("@stub").should("be.calledWith")',
    },
  ],
})
