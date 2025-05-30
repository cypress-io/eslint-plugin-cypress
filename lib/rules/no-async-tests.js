'use strict'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `async`/`await` in Cypress test cases',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-async-tests.md',
    },
    schema: [],
    messages: {
      unexpected: 'Avoid using async functions with Cypress tests',
    },
  },

  create(context) {
    function isTestBlock(callExpressionNode) {
      const { type, name } = callExpressionNode.callee

      return type === 'Identifier'
        && (name === 'it' || name === 'test')
    }

    function isTestAsync(node) {
      return node.arguments
        && node.arguments.length >= 2
        && node.arguments[1].async === true
    }
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      Identifier(node) {
        if (node.name === 'cy' || node.name === 'Cypress') {
          const ancestors = sourceCode.getAncestors
            ? sourceCode.getAncestors(node)
            : context.getAncestors()
          const asyncTestBlocks = ancestors
            .filter((n) => n.type === 'CallExpression')
            .filter(isTestBlock)
            .filter(isTestAsync)

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
