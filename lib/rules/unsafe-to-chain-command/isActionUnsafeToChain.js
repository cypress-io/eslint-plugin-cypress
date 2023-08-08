/**
 * Commands listed in the documentation with text: 'It is unsafe to chain further commands that rely on the subject after xxx.'
 * See {@link https://docs.cypress.io/guides/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle Actions should be at the end of chains, not the middle}
 * for more information.
 *
 * @type {string[]}
 */
const unsafeToChainActions = [
  'blur',
  'clear',
  'click',
  'check',
  'dblclick',
  'each',
  'focus',
  'rightclick',
  'screenshot',
  'scrollIntoView',
  'scrollTo',
  'select',
  'selectFile',
  'spread',
  'submit',
  'type',
  'trigger',
  'uncheck',
  'within',
]

/**
 * @param {import('estree').Node} node
 * @param {(string | RegExp)[]} additionalMethods
 */
const isActionUnsafeToChain = (node, additionalMethods = []) => {
  const unsafeActionsRegex = new RegExp([
    ...unsafeToChainActions.map((method) => `${method}`),
    ...additionalMethods.map((method) => {
      return method instanceof RegExp ? method.source : method
    }),
  ].join('|'))

  return (
    node.callee &&
     node.callee.property &&
     node.callee.property.type === 'Identifier' &&
     unsafeActionsRegex.test(node.callee.property.name)
  )
}

module.exports = {
  isActionUnsafeToChain,
}
