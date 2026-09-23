'use strict'

const QUERY_COMMANDS = new Set([
  'get', 'find', 'contains', 'eq', 'first', 'last', 'filter', 'children',
  'parent', 'parents', 'siblings', 'closest', 'next', 'nextAll', 'prev',
  'prevAll', 'focused', 'root', 'shadow',
])
const VALUE_COMMANDS = new Set(['its', 'invoke', 'then', 'should', 'and'])
const LANGUAGE_CHAINS = new Set([
  'to', 'be', 'been', 'is', 'that', 'which', 'and', 'has', 'have',
  'with', 'at', 'of', 'same', 'but', 'does', 'still', 'also',
])

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unnecessary assertions on Cypress chainable objects',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-assertions.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: 'This Chai assertion checks the Cypress chainable, which {{ reason }}, not its yielded subject. Use a .should(...) assertion on the yielded subject instead.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    function isUnshadowed(node, allowChaiImport = false) {
      for (let scope = sourceCode.getScope(node); scope; scope = scope.upper) {
        const variable = scope.set.get(node.name)
        if (variable) {
          const chaiImport = allowChaiImport && variable.defs.length === 1
            && variable.defs[0].type === 'ImportBinding'
            && variable.defs[0].node.type === 'ImportSpecifier'
            && variable.defs[0].node.imported.name === 'expect'
            && variable.defs[0].parent.source.value === 'chai'
            && variable.defs[0].node.importKind !== 'type'
            && variable.defs[0].parent.importKind !== 'type'
          return (variable.defs.length === 0 || chaiImport)
            && !variable.references.some((reference) => reference.isWrite())
        }
      }

      // Like the other Cypress rules, allow unconfigured framework globals,
      // but not assignments to those unresolved names in this file.
      return !sourceCode.scopeManager.globalScope.through.some((reference) =>
        reference.identifier.name === node.name && reference.isWrite())
    }

    function unwrapType(node) {
      while (['TSAsExpression', 'TSTypeAssertion', 'TSNonNullExpression', 'TSSatisfiesExpression'].includes(node.type)) {
        node = node.expression
      }
      return node
    }

    function queryChain(node) {
      const calls = []
      let current = node
      while (current.type === 'CallExpression' && !current.optional) {
        const member = current.callee
        if (member.type !== 'MemberExpression' || member.computed || member.optional) return null
        const name = member.property.name
        if (!QUERY_COMMANDS.has(name) && !VALUE_COMMANDS.has(name)) return null
        calls.unshift({ name, node: current })
        current = member.object
      }

      if (current.type !== 'Identifier' || current.name !== 'cy' || !isUnshadowed(current)) return null
      if (!calls.length || !QUERY_COMMANDS.has(calls[0].name)) return null
      return calls
    }

    function canFixQuery(calls) {
      // get('@alias') may yield arbitrary data, and a dynamic selector may
      // resolve to an alias. Neither is a proven DOM-query fix target.
      return calls.every(({ name, node }) => {
        if (!QUERY_COMMANDS.has(name)) return false
        if (name !== 'get') return true
        const selector = node.arguments[0]
        return selector && selector.type === 'Literal'
          && typeof selector.value === 'string' && !selector.value.startsWith('@')
      })
    }

    function simpleAssertion(node) {
      const props = []
      let top = node
      let args = null
      while (top.parent && top.parent.type === 'MemberExpression' && top.parent.object === top) {
        const member = top.parent
        if (member.computed || member.optional) return null
        props.push(member.property.name)
        top = member
        if (top.parent && top.parent.type === 'CallExpression' && top.parent.callee === top) {
          // Only the terminal a/an('object') may be called. Do not swallow
          // property(), equal(), lengthOf(), or any other real assertion.
          if (!['a', 'an'].includes(member.property.name) || top.parent.optional) return null
          args = top.parent.arguments
          top = top.parent
          if (top.parent && top.parent.type === 'MemberExpression' && top.parent.object === top) return null
          break
        }
      }

      const terminal = props.pop()
      const negations = props.filter((name) => name === 'not').length
      if (negations > 1 || props.some((name) => name !== 'not' && !LANGUAGE_CHAINS.has(name))) return null
      let reason
      if (!args && negations === 0 && terminal === 'exist') reason = 'always exists'
      if (!args && negations === 0 && terminal === 'ok') reason = 'is always truthy'
      if (!args && negations === 1 && terminal === 'null') reason = 'is never null'
      if (!args && negations === 1 && terminal === 'undefined') reason = 'is never undefined'
      if (args && args.length === 1 && negations === 0
        && args[0].type === 'Literal' && typeof args[0].value === 'string'
        && args[0].value.toLowerCase() === 'object') reason = 'is always an object'
      return reason ? { top, reason } : null
    }

    return {
      CallExpression(node) {
        if (node.optional || node.callee.type !== 'Identifier' || node.callee.name !== 'expect') return
        if (node.arguments.length !== 1 || !isUnshadowed(node.callee, true)) return
        const subject = node.arguments[0]
        const calls = queryChain(unwrapType(subject))
        if (!calls) return
        const assertion = simpleAssertion(node)
        if (!assertion) return
        const { top, reason } = assertion

        context.report({
          node: top,
          messageId: 'unexpected',
          data: { reason },
          fix(fixer) {
            // Report TS wrappers without rewriting their type/precedence syntax.
            if (unwrapType(subject) !== subject) return null
            if (!top.parent || top.parent.type !== 'ExpressionStatement' || !canFixQuery(calls)) return null
            if (sourceCode.getCommentsInside(top).length > sourceCode.getCommentsInside(subject).length) return null
            // Copy the expression, not the argument list (which can end in a
            // trailing comma). Avoid introducing an ASI-sensitive leading '('.
            const subjectText = sourceCode.getText(subject)
            if (subjectText.startsWith('(')) return null
            return fixer.replaceText(top, `${subjectText}.should('exist')`)
          },
        })
      },
    }
  },
}
