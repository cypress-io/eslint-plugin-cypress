'use strict'

/**
 * Whether `node` is a CallExpression that belongs to a Cypress command chain
 * rooted at `cy` (walks `callee.object` through nested calls).
 *
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
function isRootCypress(node) {
  if (
    node.type !== 'CallExpression'
    || node.callee.type !== 'MemberExpression'
  ) {
    return false
  }

  if (
    node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'cy'
  ) {
    return true
  }

  return isRootCypress(node.callee.object)
}

module.exports = { isRootCypress }
