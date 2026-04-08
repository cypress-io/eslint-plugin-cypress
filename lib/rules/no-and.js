'use strict'

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce .should() over .and() for starting assertion chains',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-and.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected:
        'Use .should() here; .and() is only allowed after .should(), .and(), or .contains().',
    },
  },

  create(context) {
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
