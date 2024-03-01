'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using async/await in Cypress before methods',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      unexpected: 'Avoid using async functions with Cypress before / beforeEach functions',
    },
  },

  create (context) {
    function isBeforeBlock (callExpressionNode) {
      const { type, name } = callExpressionNode.callee

      return type === 'Identifier'
                && name === 'before' || name === 'beforeEach'
    }

    function isBeforeAsync (node) {
      return node.arguments
                && node.arguments.length >= 2
                && node.arguments[1].async === true
    }

    return {
      Identifier (node) {
        if (node.name === 'cy' || node.name === 'Cypress') {
          const ancestors = context.getAncestors()
          const asyncTestBlocks = ancestors
          .filter((n) => n.type === 'CallExpression')
          .filter(isBeforeBlock)
          .filter(isBeforeAsync)

          if (asyncTestBlocks.length >= 1) {
            asyncTestBlocks.forEach((node) => {
              context.report({ node, messageId: 'unexpected' })
            })
          }
        }
      },
    }
  },
}
