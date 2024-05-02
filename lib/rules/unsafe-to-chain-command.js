'use strict'

const { basename } = require('path')

const NAME = basename(__dirname)
const DESCRIPTION = 'disallow actions within chains'

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
 * @type {import('eslint').Rule.RuleMetaData['schema']}
 */
const schema = {
  title: NAME,
  description: DESCRIPTION,
  type: 'object',
  properties: {
    methods: {
      type: 'array',
      description:
        'An additional list of methods to check for unsafe chaining.',
      default: [],
    },
  },
}

/**
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {Record<string, any>}
 */
const getDefaultOptions = (context) => {
  return Object.entries(schema.properties).reduce((acc, [key, value]) => {
    if (!(value.default in value)) return acc

    return {
      ...acc,
      [key]: value.default,
    }
  }, context.options[0] || {})
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: DESCRIPTION,
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/unsafe-to-chain-command.md',
    },
    schema: [schema],
    messages: {
      unexpected:
        'It is unsafe to chain further commands that rely on the subject after this command. It is best to split the chain, chaining again from `cy.` in a next command line.',
    },
  },
  create (context) {
    const { methods } = getDefaultOptions(context)

    return {
      CallExpression (node) {
        if (
          isRootCypress(node) &&
          isActionUnsafeToChain(node, methods) &&
          node.parent.type === 'MemberExpression'
        ) {
          context.report({
            node,
            messageId: 'unexpected',
          })
        }
      },
    }
  },
}

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

/**
 * @param {import('estree').Node} node
 * @param {(string | RegExp)[]} additionalMethods
 */
const isActionUnsafeToChain = (node, additionalMethods = []) => {
  const unsafeActionsRegex = new RegExp([
    ...unsafeToChainActions.map((action) => `^${action}$`),
    ...additionalMethods.map((method) => method instanceof RegExp ? method.source : method),
  ].join('|'))

  return (
    node.callee &&
    node.callee.property &&
    node.callee.property.type === 'Identifier' &&
    unsafeActionsRegex.test(node.callee.property.name)
  )
}
