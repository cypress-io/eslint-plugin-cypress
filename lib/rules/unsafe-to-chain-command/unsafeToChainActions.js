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

module.exports = {
  unsafeToChainActions,
}
