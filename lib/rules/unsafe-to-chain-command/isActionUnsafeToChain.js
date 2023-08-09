const micromatch = require('micromatch')
const { unsafeToChainActions } = require('./unsafeToChainActions')

/**
 * @param {import('estree').Node} node
 * @param {string[]} additionalMethods
 * @returns {boolean}
 */
const isActionUnsafeToChain = (node, additionalMethods = []) => {
  if (!node.callee || !node.callee.property) return false

  const { name, type } = node.callee.property

  if (type !== 'Identifier') return false

  const isUnsafeCustomCyCmd = micromatch.isMatch(name, additionalMethods)
  const isUnsafeNativeCyCmd = unsafeToChainActions.includes(name)

  return isUnsafeNativeCyCmd || isUnsafeCustomCyCmd
}

module.exports = {
  isActionUnsafeToChain,
}
