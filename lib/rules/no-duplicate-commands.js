'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow registration of custom commands with duplicate names',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
  },
  create (context) {
    const commandNames = []

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isCypressAddCommandCall (node) {
      return (
        node.callee &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object &&
        node.callee.object.type === 'MemberExpression' &&
        node.callee.object.object &&
        node.callee.object.object.name === 'Cypress' &&
        node.callee.object.property &&
        node.callee.object.property.name === 'Commands' &&
        node.callee.property &&
        node.callee.property.name === 'add'
      )
    }

    /*
      This function serves to check that the 1st argument passed to Cypress.Commands.add is a
      string, as there is no way to perform this linting check on dynamically-named commands
    */
    function argIsString (node) {
      return (
        node.arguments &&
        node.arguments[0] &&
        typeof node.arguments[0].value === 'string'
      )
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression (node) {
        if (isCypressAddCommandCall(node) && argIsString(node)) {
          const commandName = node.arguments[0].value

          if (commandNames.includes(commandName)) {
            context.report({
              node,
              message: 'Command name is already registered: {{ commandName }}',
              data: { commandName },
            })
          }

          commandNames.push(node.arguments[0].value)
        }
      },
    }
  },
}
