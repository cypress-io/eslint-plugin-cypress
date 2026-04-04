'use strict'

const { isCypressListenerCall } = require('../utils/is-cypress-listener-call')

function getListenerFunction(callNode) {
  const { arguments: args } = callNode
  for (let i = args.length - 1; i >= 0; i--) {
    const arg = args[i]
    if (arg && (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression')) {
      return arg
    }
  }
  return null
}

function isCyCallExpression(node) {
  if (node.type !== 'CallExpression') return false
  const { callee } = node
  if (callee.type === 'MemberExpression') {
    return isCyMemberChainBase(callee.object)
  }
  if (callee.type === 'Identifier' && callee.name === 'cy') {
    return true
  }
  return false
}

function isCyMemberChainBase(node) {
  if (node.type === 'Identifier' && node.name === 'cy') return true
  if (node.type === 'MemberExpression') {
    return isCyMemberChainBase(node.object)
  }
  if (node.type === 'CallExpression') {
    return isCyMemberChainBase(node.callee)
  }
  return false
}

function getCyRootCall(node) {
  if (node.type !== 'CallExpression' || !isCyCallExpression(node)) return null
  let current = node
  while (
    current.callee.type === 'MemberExpression'
    && current.callee.object.type === 'CallExpression'
    && isCyCallExpression(current.callee.object)
  ) {
    current = current.callee.object
  }
  return current
}

function walkListenerBody(node, onCyRoot) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((n) => walkListenerBody(n, onCyRoot))
    return
  }
  if (!node.type) return

  if (node.type === 'CallExpression' && isCyCallExpression(node)) {
    const root = getCyRootCall(node)
    if (node === root) onCyRoot(node)
  }
  if (node.type === 'TaggedTemplateExpression' && node.tag.type === 'Identifier' && node.tag.name === 'cy') {
    onCyRoot(node)
  }

  for (const key of Object.keys(node)) {
    if (key === 'parent' || key === 'loc' || key === 'range') continue
    const child = node[key]
    if (child && typeof child === 'object') {
      walkListenerBody(child, onCyRoot)
    }
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow Cypress commands inside `Cypress.on` / `Cypress.once` listeners',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-cy-in-cypress-listener.md',
    },
    schema: [],
    messages: {
      noCyInListener:
        'Do not call Cypress commands from inside a Cypress.on/Cypress.once listener; they are not enqueued and will not run as intended. Use synchronous logic or schedule work differently.',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!isCypressListenerCall(node)) return
        const listenerFn = getListenerFunction(node)
        if (!listenerFn) return
        const bodyRoot = listenerFn.body
        if (!bodyRoot) return
        walkListenerBody(bodyRoot, (offendingNode) => {
          context.report({ node: offendingNode, messageId: 'noCyInListener' })
        })
      },
    }
  },
}
