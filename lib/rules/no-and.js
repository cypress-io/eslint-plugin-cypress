/**
 * @fileoverview disallow the use of .and()
 * @author Todd Kemp
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of .and()',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code',
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: 'Do not use .and(); use .should() instead',
    },
  },

  create(context) {
    // variables should be defined here

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function rootIsCy(node) {
      let current = node.callee.object
      while (current) {
        if (current.type === 'Identifier' && current.name === 'cy') {
          return true
        }
        if (current.type === 'CallExpression') {
          current = current.callee.object
        }
        else if (current.type === 'MemberExpression') {
          current = current.object
        }
        else {
          break
        }
      }
      return false
    }

    const allowAndAfter = new Set(['should', 'and', 'contains'])

    function isAllowedAfter(node) {
      const object = node.callee.object
      if (
        object
        && object.type === 'CallExpression'
        && object.callee.type === 'MemberExpression'
      ) {
        return allowAndAfter.has(object.callee.property.name)
      }
      return false
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression'
          && node.callee.property.name === 'and'
          && rootIsCy(node)
          && !isAllowedAfter(node)
        ) {
          context.report({
            node,
            messageId: 'unexpected',
            fix(fixer) {
              return fixer.replaceText(node.callee.property, 'should')
            },
          })
        }
      },
    }
  },
}
