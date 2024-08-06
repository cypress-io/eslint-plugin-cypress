'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using `cy.debug()` calls',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-debug.md',
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
    messages: {
      unexpected: 'Do not use cy.debug command',
    },
  },

  create (context) {

    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function isCallingDebug (node) {
      return node.callee &&
        node.callee.property &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'debug'
    }

    function isCypressCall (node) {
      if (!node.callee || node.callee.type !== 'MemberExpression') {
        return false;
      }
      if (node.callee.object.type === 'Identifier' && node.callee.object.name === 'cy') {
        return true;
      }
      return isCypressCall(node.callee.object);
    }
    
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {

      CallExpression (node) {
        if (isCypressCall(node) && isCallingDebug(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },

    }
  },
}
