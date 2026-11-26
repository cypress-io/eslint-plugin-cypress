'use strict'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `async`/`await` in Cypress `before` methods',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-async-before.md',
    },
    schema: [],
    messages: {
      unexpected: 'Avoid using async functions with Cypress before / beforeEach functions',
    },
  },

  create(context) {
    function isBeforeBlock(callExpressionNode) {
      const { type, name } = callExpressionNode.callee

      return type === 'Identifier'
        && (name === 'before' || name === 'beforeEach')
    }

    // The hook callback is the first argument in `before(fn)` and the second
    // in `before('title', fn)`.
    function isBeforeAsync(node) {
      const callback = node.arguments.length === 1 ? node.arguments[0] : node.arguments[1]
      return Boolean(callback) && callback.async === true
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
