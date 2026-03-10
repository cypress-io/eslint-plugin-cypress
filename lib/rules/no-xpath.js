'use strict'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `cy.xpath()` calls',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-xpath.md',
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected:
        'cy.xpath() is deprecated and unsupported. '
        + 'Consider using cy.get() with appropriate selectors instead.',
    },
    deprecated: {
      message:
        'The reason for rule deprecation is the underlying deprecation and removal of support for the `@cypress/xpath` npm module in 2023. '
        + 'The rule is currently provided as a convenience to identify existing code that requires migration to supported API calls '
        + 'and it is planned for removal in a future major release of the plugin.',
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
