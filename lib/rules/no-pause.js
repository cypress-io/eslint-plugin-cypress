'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow using of \'cy.pause\' calls',
      category: 'Possible Errors',
      recommended: false,
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
      return node.property &&
        node.property.type === 'Identifier' &&
        node.property.name === 'pause'
    }

    function isCypressCall (node) {
      return node.callee.type === 'MemberExpression' &&
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
