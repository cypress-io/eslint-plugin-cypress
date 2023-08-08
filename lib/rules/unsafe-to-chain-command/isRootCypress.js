/**
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
const isRootCypress = (node) => {
  if (
    node.type !== 'CallExpression' ||
     node.callee.type !== 'MemberExpression'
  ) {
    return false
  }

  if (
    node.callee.object.type === 'Identifier' &&
     node.callee.object.name === 'cy'
  ) {
    return true
  }

  return isRootCypress(node.callee.object)
}

module.exports = {
  isRootCypress,
}
