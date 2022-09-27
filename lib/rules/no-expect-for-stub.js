/**
 * @fileoverview Use cy.get("@stub").should(…) instead of expect(stub)…
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {
  getExpectArgument,
  convertExpectToShould,
  chainerMethods,
  chainerProperties,
} = require('../helpers/expect-helpers.js')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Use cy.get("@stub").should(…) instead of expect(stub)…',
      category: 'Suggestions',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: { 'message': 'Prefer cy.get("@stub").should(…) over expect(stub)…' },
  },

  create (context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function fixCall (fixer, expectNode, expectArgument) {
      let shouldString = convertExpectToShould(expectNode, context)
      let replacement = `cy.get("@${expectArgument}")${shouldString}`

      return fixer.replaceText(expectNode, replacement)
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // e.g., expect(stub).to.have.been.calledWith(…)
      CallExpression (node) {
        let assertion = node.callee?.property?.name
        let expectExpression = node.callee

        if (!chainerMethods.includes(assertion)) return

        let expectArgument = getExpectArgument(expectExpression)

        if (!expectArgument) return

        context.report({
          node,
          messageId: 'message',
          fix: (fixer) => fixCall(fixer, node, expectArgument),
        })
      },
      // e.g., expect(stub).to.have.been.calledOnce
      MemberExpression (node) {
        let assertion = node.property.name
        let expectExpression = node.object

        if (!chainerProperties.includes(assertion)) return

        let expectArgument = getExpectArgument(expectExpression)

        if (!expectArgument) return

        context.report({
          node,
          messageId: 'message',
          fix: (fixer) => fixCall(fixer, node, expectArgument),
        })
      },
    }
  },
}
