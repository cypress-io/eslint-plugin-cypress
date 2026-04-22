'use strict'

const { isCypressListenerCall } = require('../utils/is-cypress-listener-call')

const EACH_HOOKS = new Set(['beforeEach', 'afterEach'])
const TEST_INVOKERS = new Set(['it', 'test', 'specify'])

function getMochaCalleeName(callee) {
  if (callee.type === 'Identifier') {
    return callee.name
  }
  if (
    callee.type === 'MemberExpression'
    && !callee.computed
    && callee.object.type === 'Identifier'
    && callee.property.type === 'Identifier'
  ) {
    const obj = callee.object.name
    const prop = callee.property.name
    if ((obj === 'it' || obj === 'test' || obj === 'specify') && (prop === 'only' || prop === 'skip')) {
      return obj
    }
  }
  return null
}

function getMochaCallback(callExpr) {
  const [first, second] = callExpr.arguments
  if (first && (first.type === 'ArrowFunctionExpression' || first.type === 'FunctionExpression')) {
    return first
  }
  if (second && (second.type === 'ArrowFunctionExpression' || second.type === 'FunctionExpression')) {
    return second
  }
  return null
}

function getDisallowedRegistrationContext(cypressListenerNode, context) {
  const sourceCode = context.sourceCode ?? context.getSourceCode()
  const ancestors = sourceCode.getAncestors
    ? sourceCode.getAncestors(cypressListenerNode)
    : context.getAncestors()

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const anc = ancestors[i]
    if (anc.type !== 'CallExpression') continue
    const name = getMochaCalleeName(anc.callee)
    if (!name) continue
    const cb = getMochaCallback(anc)
    if (!cb) continue
    if (!ancestors.includes(cb)) continue
    if (EACH_HOOKS.has(name)) return 'eachHook'
    if (TEST_INVOKERS.has(name)) return 'testBlock'
  }
  return null
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow `Cypress.on` / `Cypress.once` inside test bodies or each hooks (session-wide listeners and duplicate registration)',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-cypress-on-in-each-or-test.md',
    },
    schema: [],
    messages: {
      inTestBlock:
        'Cypress.on/Cypress.once listeners stay registered for the rest of the browser session, not just this test. Prefer a support file, a suite-level hook, or cy.on for per-test behavior.',
      inEachHook:
        'Cypress.on/Cypress.once in beforeEach/afterEach adds another listener every time the hook runs; Cypress does not auto-remove them like cy.on. Register once (for example in a support file or a before hook) or call Cypress.off with the same handler when finished.',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!isCypressListenerCall(node)) return
        const ctx = getDisallowedRegistrationContext(node, context)
        if (ctx === 'testBlock') {
          context.report({ node, messageId: 'inTestBlock' })
        }
        if (ctx === 'eachHook') {
          context.report({ node, messageId: 'inEachHook' })
        }
      },
    }
  },
}
