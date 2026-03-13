/**
 * Checks if the root of a call expression originated from a 'cy' identifier.
 * If type information are available, additionally checks the return type of helper functions.
 *
 * @param {import('estree').Node} node
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {boolean}
 */
const isRootCypress = (node, context) => {
  if (node.type !== 'CallExpression') {
    return false
  }

  const calleeType = node.callee.type
  if (calleeType === 'MemberExpression') {
    if (node.callee.object.type === 'Identifier' && node.callee.object.name === 'cy') {
      return true
    }

    return isRootCypress(node.callee.object, context)
  }

  if (calleeType === 'Identifier') {
    const services = context?.sourceCode?.parserServices
    if (services?.program && services.esTreeNodeToTSNodeMap) {
      const checker = services.program.getTypeChecker()
      const tsNode = services.esTreeNodeToTSNodeMap.get(node)
      const signature = checker.getResolvedSignature(tsNode)

      if (signature) {
        const returnType = checker.getReturnTypeOfSignature(signature)
        const symbol = returnType.getSymbol()
        if (symbol) {
          return checker.getFullyQualifiedName(symbol) === 'Cypress.Chainable'
        }
      }
    }
  }

  return false
}

module.exports = { isRootCypress }
