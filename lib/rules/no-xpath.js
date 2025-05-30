'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using `cy.xpath()` calls',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-xpath.md',
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: 'Avoid using cy.xpath command',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (isCallingCyXpath(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function isCallingCyXpath(node) {
  return node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'cy'
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'xpath'
}
