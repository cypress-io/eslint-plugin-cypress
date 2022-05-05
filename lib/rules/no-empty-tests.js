'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'Checks for empty tests',
      category: 'Possibly Errors',
      recommended: 'error',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      unexpected: 'Do not keep empty tests',
      skipTest: 'Skip the test',
      removeTest: 'Remove the test',
    },
  },

  create (context) {

    function addSkip (node) {
      return (fixer) => fixer.insertTextAfter(node.callee, '.skip')
    }

    function removeTest (node) {
      return (fixer) => fixer.remove(node)
    }

    return {
      CallExpression (node) {
        if (isEmptyTest(node) && !areParentsSkipped(node)) {
          return context.report({
            node,
            messageId: 'unexpected',
            fix: addSkip(node),
            suggest: [
              {
                messageId: 'skipTest',
                fix: addSkip(node),
              },
              {
                messageId: 'removeTest',
                fix: removeTest(node),
              },
            ],
          })
        }
      },
    }
  },
}

const checkNode = (names) => {
  return (node) => {
    return node.type === 'CallExpression' && (
      (node.callee.type === 'MemberExpression' &&
         node.callee.object.type === 'Identifier' &&
         names.includes(node.callee.object.name)) ||
         (node.callee.type === 'Identifier' && names.includes(node.callee.name)))
  }
}

const isTest = checkNode(['test', 'it'])
const isGroup = checkNode(['describe', 'context'])

function isEmptyTest (node) {
  return isTest(node) && !isSkipped(node) && isFunctionEmpty(node)
}

function isFunctionEmpty (node) {
  return ['ArrowFunctionExpression', 'FunctionExpression', 'Identifier']
  .includes(node.arguments[1].type) &&
  node.arguments[1].body.body.length === 0
}

function isSkipped (node) {
  return node.type === 'CallExpression' &&
         node.callee.type === 'MemberExpression' &&
         node.callee.property.type === 'Identifier' &&
         node.callee.property.name === 'skip'
}

function areParentsSkipped (node) {
  while (node.parent) {
    node = node.parent
    if (isGroup(node) && isSkipped(node)) {
      return true
    }
  }

  return false
}
