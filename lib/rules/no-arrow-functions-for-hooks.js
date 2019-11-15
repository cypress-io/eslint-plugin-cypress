/**
 * @fileoverview Assert that arrow functions are not used for hooks, so "this" is accessible.
 * @author Hugo Alliaume
 */

'use strict'

const hooks = {
  describe: { functionPosition: 1 },
  context: { functionPosition: 1 },
  it: { functionPosition: 1 },
  specify: { functionPosition: 1 },
  before: { functionPosition: 0 },
  beforeEach: { functionPosition: 0 },
  after: { functionPosition: 0 },
  afterEach: { functionPosition: 0 },
}

module.exports = {
  meta: {
    docs: {
      description: 'Assert that arrow functions are not used for hooks, so "this" is accessible.',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
    messages: {
      unexpected: 'Don\'t use an arrow function because you have no access to "this".',
    },
  },
  create (context) {
    return {
      CallExpression (node) {
        if (isMochaHook(node) && isUsingArrowFunction(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function isMochaHook (node) {
  return getHookName(node) in hooks
}

function getHookName (node) {
  return node.callee.type === 'Identifier'
    ? node.callee.name
    : node.callee.type === 'MemberExpression'
      ? node.callee.object.name
      : null
}

function isUsingArrowFunction (node) {
  const functionNode = node.arguments[hooks[getHookName(node)].functionPosition]

  return functionNode.type === 'ArrowFunctionExpression'
}
