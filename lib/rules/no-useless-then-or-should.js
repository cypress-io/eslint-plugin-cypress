/**
 * @fileoverview `.should()` and `.then()` can be removed when they only wrap commands
 * @author Damien Cassou
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { getInitialReceiver } = require('../helpers/expect-helpers.js')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '`.should()` and `.then()` can be removed when they only wrap commands',
      category: 'Suggestions',
      recommended: false,
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [],
  },

  create (context) {
    const MESSAGE = '`.should()` and `.then()` can be removed when they only wrap commands'

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Return the range of Cypress command calls in `node` if `node`
     * only contains Cypress command calls. Return undefined
     * otherwise.
     */
    function isOnlyContainingCommandCalls (node) {
      switch (node.type) {
        case 'CallExpression':
          return isCommandCallExpression(node)
            ? { start: node.range[0], end: node.range[1] }
            : undefined
        case 'BlockStatement':
          return areOnlyContainingCommandCalls(node.body)
            ? { start: node.range[0] + 1, end: node.range[1] - 1 }
            : undefined
        case 'ExpressionStatement':
          return isOnlyContainingCommandCalls(node.expression)
        default:
          return undefined
      }
    }

    function areOnlyContainingCommandCalls (nodes) {
      return nodes.every(isOnlyContainingCommandCalls)
    }

    /**
     * Return true iff `node` is a call expression to a Cypress
     * command (e.g., `cy.get()` as opposed to `f()`). The function
     * makes the strong assumptions that:
     *
     * - all commands are called of `cy`, and
     * - all functions called on `cy` are commands.
     */
    function isCommandCallExpression (node) {
      if (node.type !== 'CallExpression') return false

      let initialReceiver = getInitialReceiver(node)

      if (initialReceiver.type !== 'Identifier') return false

      return initialReceiver.name === 'cy'
    }

    function fixCall (fixer, callExpressionNode, commandStatementsRange) {
      let sourceCode = context.getSourceCode()

      let commandStatementsCode = sourceCode.getText().substring(
        commandStatementsRange.start,
        commandStatementsRange.end,
      ).trim()

      let replacementString

      if (['cy.then', 'cy.should'].includes(sourceCode.getText(callExpressionNode.callee))) {
        replacementString = commandStatementsCode
      } else {
        replacementString = `${sourceCode.getText(callExpressionNode.callee.object) };${ commandStatementsCode}`
      }

      return fixer.replaceText(callExpressionNode, replacementString)
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression (node) {
        if (node.callee.type !== 'MemberExpression') return

        let calleeName = node.callee.property.name

        if (!['then', 'should'].includes(calleeName)) return

        if (!node.arguments.length === 1) return

        let thenArgument = node.arguments[0]

        if (thenArgument.type !== 'ArrowFunctionExpression') return

        // Check the function argument takes 0 arguments:
        if (thenArgument.params.length !== 0) return

        let commandStatementsRange = isOnlyContainingCommandCalls(thenArgument.body)

        if (!commandStatementsRange) return

        context.report({ node, message: MESSAGE, fix: (fixer) => fixCall(fixer, node, commandStatementsRange) })
      },
    }
  },
}
