'use strict'

const { getCypressRoot } = require('./utils/is-root-cypress')

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

function isCypressCommandDeclaration(declarator) {
  const init = declarator.init

  if (!init) return

  const root = getCypressRoot(init)

  if (!root) return

  const commandName = get(init, 'callee.property.name')
  const rootCommandName = get(root, 'callee.property.name')

  if (commandName && allowedCommands[commandName]) return
  if (rootCommandName && allowedCommands[rootCommandName]) return

  return true
}
