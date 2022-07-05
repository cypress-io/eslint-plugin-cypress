/**
 * @fileoverview Simplify tests by avoiding lonely expect()
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { getExpectArgument, convertExpectToShould } = require('../helpers/expect-helpers.js')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Simplify tests by avoiding lonely expect().',
      category: 'Suggestions',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },

  create (context) {
    const MESSAGE_THEN = 'A single expect() in a then() can be rewritten with a should().'
    const MESSAGE_SHOULD = 'A single expect() in a should() can be rewritten with just a should().'

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Use `fixer` to rewrite `thenOrShouldCallNode` (a call to
     * `then()` or `should()` with a lonely `expect()` call as body).
     */
    function fixCall (fixer, thenOrShouldCallNode, expectNode) {
      // shouldString is, e.g., .should("equal", 2)
      let shouldString = convertExpectToShould(expectNode, context)

      // thenSubjectString is, e.g., cy.foo().bar()
      let thenReceiverString = context.getSourceCode().getText(thenOrShouldCallNode.callee.object)

      return fixer.replaceText(thenOrShouldCallNode, thenReceiverString + shouldString)
    }

    /**
     * Report an error with `message` if both conditions are satisfied:
     *
     * - `thenOrShouldCallNode` contains as single argument a function
     * with a lonely `expect()` statement, and
     *
     * - the `expect()` must take as argument the same object as the
     * one passed to the function.
     */
    function checkThenOrShould (thenOrShouldCallNode, message) {
      if (thenOrShouldCallNode.arguments.length !== 1) return

      let argument = thenOrShouldCallNode.arguments[0]

      if (argument.type !== 'ArrowFunctionExpression') return

      // Check the function argument takes 1 and only 1 argument:
      if (argument.params.length !== 1) return

      let anonymousFunctionArgumentName = argument.params[0].name

      if (!anonymousFunctionArgumentName) return

      // Check there is 1 and only 1 expression in the body:
      if (!argument.body?.body || argument.body.body.length !== 1) return

      let thenArgumentBody = argument.body.body[0]

      if (thenArgumentBody.type !== 'ExpressionStatement') return

      let expectExpression

      switch (thenArgumentBody.expression.type) {
        case 'CallExpression':
          expectExpression = thenArgumentBody.expression.callee
          break
        case 'MemberExpression':
          expectExpression = thenArgumentBody.expression.object
          break
        default:
          return
      }

      let expectArgument = getExpectArgument(expectExpression)

      if (expectArgument === anonymousFunctionArgumentName) {
        context.report({
          node: thenOrShouldCallNode,
          message,
          fix: (fixer) => fixCall(fixer, thenOrShouldCallNode, thenArgumentBody.expression),
        })
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression (node) {
        if (node.callee.type !== 'MemberExpression') return

        switch (node.callee.property.name) {
          case 'then':
            checkThenOrShould(node, MESSAGE_THEN)
            break
          case 'should':
            checkThenOrShould(node, MESSAGE_SHOULD)
            break
          default:
            return
        }
      },
    }
  },
}
