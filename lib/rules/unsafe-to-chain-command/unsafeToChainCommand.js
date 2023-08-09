'use strict'

const { isActionUnsafeToChain } = require('./isActionUnsafeToChain')
const { isRootCypress } = require('./isRootCypress')
const { getDefaultOptions } = require('./getDefaultOptions')

/** @type {import('eslint').Rule.RuleMetaData['schema']} */
const schema = require('./schema.json')

/** @type {import('eslint').Rule.RuleModule} */
const unsafeToChainCommand = {
  meta: {
    docs: {
      description: schema.description,
      category: 'Possible Errors',
      recommended: true,
      url: 'https://docs.cypress.io/guides/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle',
    },
    schema: [schema],
    messages: {
      unexpected:
        'It is unsafe to chain further commands that rely on the subject after this command. It is best to split the chain, chaining again from `cy.` in a next command line.',
    },
  },
  create (context) {
    const { methods } = getDefaultOptions(schema, context)

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

module.exports = unsafeToChainCommand
