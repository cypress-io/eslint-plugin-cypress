'use strict'

const LISTENER_METHODS = new Set(['on', 'once'])

function isCypressListenerCall(node) {
  if (node.type !== 'CallExpression') return false
  const { callee } = node
  if (callee.type !== 'MemberExpression' || callee.computed) return false
  if (callee.object.type !== 'Identifier' || callee.object.name !== 'Cypress') return false
  if (callee.property.type !== 'Identifier' || !LISTENER_METHODS.has(callee.property.name)) {
    return false
  }
  return true
}

module.exports = { isCypressListenerCall }
