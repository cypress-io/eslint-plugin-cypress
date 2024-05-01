'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using `cy.pause()` calls',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-pause.md',
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
    messages: {
      unexpected: 'Do not use cy.pause command',
    },
  },

  create (context) {

    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function isCallingPause (node) {
      return node.callee &&
        node.callee.property &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'pause'
    }

    function isCypressCall (node) {
      return node.callee &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'cy'
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {

      CallExpression (node) {
        if (isCypressCall(node) && isCallingPause(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },

    }
  },
}
