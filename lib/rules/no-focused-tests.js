/**
 * @fileoverview Disallow focused tests
 * @author Jonathan Chaffer
 */
'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Disallow focused tests',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
    messages: {
      unexpected: 'Do not use focused tests',
    },
  },

  create (context) {
    return {
      CallExpression (node) {
        if (!isTestCaseCall(node) && !isDescribeCall(node)) {
          return
        }

        const onlyNode = findOnlyNode(node)

        if (!onlyNode) {
          return
        }

        context.report({
          node: onlyNode,
          messageId: 'unexpected',
        })
      },
    }
  },
}

function nodeIsCalledBy (name, node) {
  if (node.type === 'Identifier' && node.name === name) return true

  if (
    typeof node.callee === 'undefined' ||
    typeof node.callee.object === 'undefined'
  ) {
    return false
  }

  return nodeIsCalledBy(name, node.callee.object)
}

function isDescribeCall (node) {
  return (
    node.callee.type === 'MemberExpression' &&
    nodeIsCalledBy('describe', node) &&
    node.callee.property.type === 'Identifier'
  )
}

function isTestCaseCall (node) {
  return (
    node.callee.type === 'MemberExpression' &&
    nodeIsCalledBy('it', node) &&
    node.callee.property.type === 'Identifier'
  )
}

function findOnlyNode (node) {
  const callee =
    node.callee.type === 'TaggedTemplateExpression'
      ? node.callee.tag
      : node.callee.type === 'CallExpression'
        ? node.callee.callee
        : node.callee

  if (callee.type === 'MemberExpression') {
    if (callee.object.type === 'MemberExpression') {
      return callee.object.property
    }

    return callee.property
  }

  return null
}
