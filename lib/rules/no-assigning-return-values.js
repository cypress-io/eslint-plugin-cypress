'use strict'

// safely get nested object property
function get(obj, propertyString = '') {
  const properties = propertyString.split('.')

  for (let i = 0; i < properties.length; i++) {
    const value = (obj || {})[properties[i]]

    if (value == null) return value

    obj = value
  }

  return obj
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow assigning return values of `cy` calls',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-assigning-return-values.md',
    },
    schema: [],
    messages: {
      unexpected: 'Do not assign the return value of a Cypress command',
    },
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.declarations.some(isCypressCommandDeclaration)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

const allowedCommands = {
  now: true,
  spy: true,
  state: true,
  stub: true,
}

// Detects `cy.foo()` chains, honouring the commands that are allowed to return
// a value.
function isCypressCommandExpression(expression, variableName) {
  let object = get(expression, 'callee.object')

  if (!object) return false

  while (object.callee) {
    object = object.callee.object

    if (!object) return false
  }

  const commandName = get(expression, 'callee.property.name')
  const parent = get(object, 'parent.property.name') || variableName

  if (commandName && (allowedCommands[commandName] || allowedCommands[parent])) {
    return false
  }

  return object.name === 'cy'
}

// Walks into conditional expressions so `cond ? cy.get() : cy.get()` is caught
// as well.
function isCypressAssignment(expression, variableName) {
  if (expression.type === 'ConditionalExpression') {
    return (
      isCypressAssignment(expression.consequent, variableName)
      || isCypressAssignment(expression.alternate, variableName)
    )
  }

  return isCypressCommandExpression(expression, variableName)
}

function isCypressCommandDeclaration(declarator) {
  const init = get(declarator, 'init')

  if (!init) return false

  return isCypressAssignment(init, get(declarator, 'id.name'))
}
