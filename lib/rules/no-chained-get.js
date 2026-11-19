'use strict'

const { isRootCypress } = require('../utils/is-root-cypress')

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
    const isGetCall = (node) =>
      node.type === 'CallExpression'
      && node.callee.type === 'MemberExpression'
      && node.callee.property.type === 'Identifier'
      && node.callee.property.name === 'get'

    // `.get('@alias')` only reads an alias; it does not search the page.
    const isAliasGet = (node) => {
      const [arg] = node.arguments
      if (!arg) {
        return false
      }
      if (arg.type === 'Literal') {
        return typeof arg.value === 'string' && arg.value.startsWith('@')
      }
      if (arg.type === 'TemplateLiteral') {
        return arg.quasis[0].value.cooked.startsWith('@')
      }
      return false
    }

    // `.get()` always queries from the root, so any `.get()` that comes later
    // in the same chain (even after `.find()`, `.should()`, ...) ignores the
    // earlier `.get()` subject.
    const hasChainedGet = (node) => {
      if (!isGetCall(node) || isAliasGet(node)) {
        return false
      }

      let current = node.callee.object

      while (current.type === 'CallExpression' && current.callee.type === 'MemberExpression') {
        if (isGetCall(current)) {
          return true
        }
        current = current.callee.object
      }

      return false
    }

    return {
      CallExpression(node) {
        if (isRootCypress(node) && hasChainedGet(node)) {
          context.report({
            node,
            messageId: 'unexpected',
          })
        }
      },
    }
  },
}
