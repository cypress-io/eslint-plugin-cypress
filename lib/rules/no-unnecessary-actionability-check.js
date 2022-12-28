'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of redundant \'should\' assertions.',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-actionability-check.md',
    },
    schema: [],
    messages: {
      unexpected: '\'should\' check is redudant here. Following action already performs implicit actionability checks.',
    },
  },
  create (context) {
    return {
      CallExpression (node) {
        const scope = context.getScope()

        if (isRootCypress(node) && isActionabilityRedundantAssure(node, scope) && deepCheck(node.parent, isActionabilityImplicitCall)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function deepCheck (node, checkFunc) {
  let currentNode = node

  while (currentNode.parent) {

    if (checkFunc(currentNode.parent)) {
      return true
    }

    currentNode = currentNode.parent
  }

  return false
}

function isRootCypress (node) {
  while (node.type === 'CallExpression') {
    if (node.callee.type !== 'MemberExpression') return false

    if (node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'cy') {
      return true
    }

    node = node.callee.object
  }

  return false
}

function isActionabilityRedundantAssure (node, scope) {
  const redundantAssureTypes = ['be.visible', 'not.be.disabled']

  const isShould = node.callee && node.callee.property && node.callee.property.type === 'Identifier' && node.callee.property.name === 'should'

  if (!isShould) return false

  const argValue = getFirstArgumentValue(node, scope)

  return redundantAssureTypes.includes(argValue)
}

function getFirstArgumentValue (node, scope) {
  if (!node.arguments.length) return undefined

  if (node.arguments[0].type === 'Literal' && typeof (node.arguments[0].value) === 'string') {
    return node.arguments[0].value
  }

  if (node.arguments[0].type !== 'Identifier') return false

  const identifier = node.arguments[0]
  const resolvedIdentifier = scope.references.find((ref) => ref.identifier === identifier).resolved
  const definition = resolvedIdentifier.defs[0]
  const isVariable = definition.type === 'Variable'

  if (isVariable) {
    if (!definition.node.init) return false

    return definition.node.init.value
  }

  const param = definition.node.params[definition.index]

  // we can't know the type of value, so don't fail
  if (!param || param.type !== 'AssignmentPattern') return false

  return param.right.value
}

function isExplicitelyForced (node) {
  return node.arguments && node.arguments.length &&
  node.arguments.some((arg) => {
    return arg.type === 'ObjectExpression' && arg.properties.some((propNode) => propNode.key && propNode.key.name === 'force' && propNode.value && propNode.value.value === true)
  })
}

function isActionabilityImplicitCall (node) {
  const allowedMethods = ['click', 'dblclick', 'rightclick', 'type', 'clear', 'check', 'uncheck', 'select', 'trigger', 'selectFile']

  return node.callee && node.callee.property && node.callee.property.type === 'Identifier' && allowedMethods.includes(node.callee.property.name) && !isExplicitelyForced(node)
}
