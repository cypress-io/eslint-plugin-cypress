'use strict'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow waiting for arbitrary time periods',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-waiting.md',
    },
    schema: [],
    messages: {
      unexpected: 'Do not wait for arbitrary time periods',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      CallExpression(node) {
        if (isCallingCyWait(node)) {
          const scope = sourceCode.getScope
            ? sourceCode.getScope(node)
            : context.getScope()

          if (isIdentifierNumberConstArgument(node, scope) || isNumberArgument(node)) {
            context.report({ node, messageId: 'unexpected' })
          }
        }
      },
    }
  },
}

function nodeIsCalledByCy(node) {
  if (node.type === 'Identifier' && node.name === 'cy') return true

  if (typeof node.callee === 'undefined' || typeof node.callee.object === 'undefined') {
    return false
  }

  return nodeIsCalledByCy(node.callee.object)
}

function isCallingCyWait(node) {
  return node.callee.type === 'MemberExpression'
    && nodeIsCalledByCy(node)
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'wait'
}

function isNumberArgument(node) {
  return node.arguments.length > 0
    && node.arguments[0].type === 'Literal'
    && typeof (node.arguments[0].value) === 'number'
}

function isIdentifierNumberConstArgument(node, scope) {
  if (node.arguments.length === 0) return false

  if (node.arguments[0].type !== 'Identifier') return false

  const identifier = node.arguments[0]
  const resolvedIdentifier = scope.references.find((ref) => ref.identifier === identifier).resolved
  const definition = resolvedIdentifier.defs[0]
  const isVariable = definition.type === 'Variable'

  // const amount = 1000 or const amount = '@alias'
  // cy.wait(amount)
  if (isVariable) {
    if (!definition.node.init) return false

    return typeof definition.node.init.value === 'number'
  }

  // import { WAIT } from './constants'
  // cy.wait(WAIT)
  // we don't know if WAIT is a number or alias '@someRequest', so don't fail
  if (definition.type === 'ImportBinding') return false

  const param = definition.node.params[definition.index]

  // function wait (amount) { cy.wait(amount) }
  // we can't know the type of value, so don't fail
  if (!param || param.type !== 'AssignmentPattern') return false

  // function wait (amount = 1) { cy.wait(amount) } or
  // function wait (amount = '@alias') { cy.wait(amount) }
  return typeof param.right.value === 'number'
}
