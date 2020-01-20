/**
 * @fileoverview Assert on the page state before taking a percySnapshot, so the percySnapshot is consistent
 * @author Matt Charlton, copied from assertion-before-screenshot by Luke Page.
 */

'use strict'

const assertionCommands = [
  // assertions
  'should',
  'and',
  'contains',

  // retries until it gets something
  'get',

  // not an assertion, but unlikely to require waiting for render
  'scrollIntoView',
  'scrollTo',
];

module.exports = {
  meta: {
    docs: {
      description: 'Assert on the page state before taking a percySnapshot, so the snapshot is consistent',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
    messages: {
      unexpected: 'Make an assertion on the page state before taking a percySnapshot',
    },
  },
  create (context) {
    return {
      CallExpression (node) {
        if (isCallingCyPercySnapshot(node) && !isPreviousAnAssertion(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function isRootCypress(node) {
  while(node.type === 'CallExpression') {
    if (node.callee.type !== 'MemberExpression') return false
    if (node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'cy') {
      return true
    }
    node = node.callee.object
  }
  return false
}

function getPreviousInChain(node) {
  return node.type === 'CallExpression' &&
         node.callee.type === 'MemberExpression' &&
         node.callee.object.type === 'CallExpression' &&
         node.callee.object.callee.type === 'MemberExpression' &&
         node.callee.object.callee.property.type === 'Identifier' &&
         node.callee.object.callee.property.name
}

function getCallExpressionCypressCommand(node) {
  return isRootCypress(node) &&
         node.callee.property.type === 'Identifier' &&
         node.callee.property.name
}

function isCallingCyPercySnapshot (node) {
  return getCallExpressionCypressCommand(node) === 'percySnapshot'
}

function getPreviousCypressCommand(node) {
  const previousInChain = getPreviousInChain(node)

  if (previousInChain) {
    return previousInChain
  }

  while(node.parent && !node.parent.body) {
    node = node.parent
  }

  if (!node.parent || !node.parent.body) return null

  const body = node.parent.body.type === 'BlockStatement' ? node.parent.body.body : node.parent.body

  const index = body.indexOf(node)

  // in the case of a function declaration it won't be found
  if (index < 0) return null

  if (index === 0) return getPreviousCypressCommand(node.parent);

  const previousStatement = body[index - 1]

  if (previousStatement.type !== 'ExpressionStatement' ||
      previousStatement.expression.type !== 'CallExpression')
    return null

  return getCallExpressionCypressCommand(previousStatement.expression)
}

function isPreviousAnAssertion (node) {
  const previousCypressCommand = getPreviousCypressCommand(node)
  return assertionCommands.indexOf(previousCypressCommand) >= 0
}
