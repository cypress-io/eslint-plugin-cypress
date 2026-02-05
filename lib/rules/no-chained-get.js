'use strict'

const { hasCypressRoot } = require('./utils/is-root-cypress')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow chain of `cy.get()` calls',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-chained-get.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Avoid chaining multiple cy.get() calls',
    },
  },

  create(context) {
    const hasChainedGet = (node) => {
      // Check if this node is a get() call
      const isGetCall
        = node.callee
          && node.callee.type === 'MemberExpression'
          && node.callee.property
          && node.callee.property.type === 'Identifier'
          && node.callee.property.name === 'get'

      if (!isGetCall) {
        return false
      }

      const obj = node.callee.object

      if (obj.type === 'CallExpression') {
        const objCallee = obj.callee

        if (
          objCallee
          && objCallee.type === 'MemberExpression'
          && objCallee.property
          && objCallee.property.type === 'Identifier'
          && objCallee.property.name === 'get'
        ) {
          return true
        }

        return hasChainedGet(obj)
      }

      return false
    }

    return {
      CallExpression(node) {
        if (hasCypressRoot(node) && hasChainedGet(node)) {
          context.report({
            node,
            messageId: 'unexpected',
          })
        }
      },
    }
  },
}
