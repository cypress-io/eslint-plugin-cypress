/**
 * @fileoverview Assert that arrow functions are not used for hooks, so "this" is accessible.
 * @author Hugo Alliaume
 */

'use strict'

const hooks = [
  'describe',
  'context',
  'it',
  'specify',
  'before',
  'beforeEach',
  'after',
  'afterEach',
]

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
      [generateSelector()] (node) {
        if (!isThisValid(node)) {
          context.report({ node, messageId: 'unexpected' })
        }
      },
    }
  },
}

function generateSelector () {
  return `CallExpression[callee.name=/^(${hooks.join('|')})$/] ThisExpression`
}

function isThisValid (node) {
  const nodeFunction = getParentFunctionOrArrowFunctionExpression(node)
  const nodeHook = getParentHook(node)

  if (!nodeFunction || !nodeHook) {
    return
  }

  if (nodeFunction.type === 'ArrowFunctionExpression') {
    if (nodeHook.type === 'ArrowFunctionExpression') return false

    if (nodeHook.type === 'FunctionExpression') return true
  }

  if (nodeFunction.type === 'FunctionExpression') {
    return false
  }

  return false
}

function getParentFunctionOrArrowFunctionExpression (node) {
  while (node.parent && !['FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
    node = node.parent
  }

  return node
}

function getParentHook (node) {
  while (node.parent && !isHook(node)) {
    node = node.parent
  }

  return node
}

function isHook (node) {
  if (node.callee && node.callee.type === 'Identifier') return hooks.includes(node.callee.name)

  if (node.callee && node.callee.type === 'MemberExpression') return hooks.includes(node.callee.object.name)

  return false
}
