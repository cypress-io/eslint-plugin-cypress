'use strict'
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require `data-*` attribute selectors',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/require-data-selectors.md',
    },
    schema: [],
    messages: {
      unexpected: 'use data-* attribute selectors instead of classes or tag names',
    },
  },

  create(context) {
    const variablesSet = new Set()
    return {
      VariableDeclarator(node) {
        if (node.init && node.id && node.id.type === 'Identifier') {
          let selectorValue = null

          if (node.init.type === 'Literal' && typeof node.init.value === 'string') {
            selectorValue = node.init.value
          }
          else if (node.init.type === 'TemplateLiteral'
            && node.init.expressions.length === 0
            && node.init.quasis.length === 1) {
            selectorValue = node.init.quasis[0].value.cooked
          }

          if (selectorValue && isAliasOrDataSelector(selectorValue)) {
            variablesSet.add(node.id.name)
          }
        }
      },

      CallExpression(node) {
        if (isCallingCyGet(node) && !isDataArgument(node, variablesSet)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function isCallingCyGet(node) {
  return node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'cy'
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'get'
}

function isDataArgument(node, dataVariables) {
  if (node.arguments.length === 0) return false

  const firstArg = node.arguments[0]

  if (firstArg.type === 'Literal') {
    return isAliasOrDataSelector(String(firstArg.value))
  }

  if (firstArg.type === 'TemplateLiteral') {
    return isAliasOrDataSelector(String(firstArg.quasis[0].value.cooked))
  }

  if (firstArg.type === 'Identifier') {
    return dataVariables.has(firstArg.name)
  }

  return false
}

function isAliasOrDataSelector(selector) {
  return ['[data-', '@'].some(function (validValue) {
    return selector.startsWith(validValue)
  })
}
