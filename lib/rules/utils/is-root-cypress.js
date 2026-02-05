'use strict'

/**
 * @param {import('estree').Node} node
 * @returns {import('estree').CallExpression | null}
 */
function getCypressRoot(node) {
  if (
    node.type !== 'CallExpression'
    || node.callee.type !== 'MemberExpression'
  ) {
    return null
  }

  if (
    node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'cy'
  ) {
    return node
  }

  return getCypressRoot(node.callee.object)
}

/**
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
function hasCypressRoot(node) {
  return getCypressRoot(node) !== null
}

module.exports = { hasCypressRoot, getCypressRoot }
