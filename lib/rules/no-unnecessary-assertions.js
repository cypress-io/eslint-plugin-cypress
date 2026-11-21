'use strict'

// Only these queries can start a chain from `cy`. The rest need a subject.
const CHAIN_STARTERS = new Set(['get', 'contains', 'focused', 'root'])
const QUERY_COMMANDS = new Set([
  ...CHAIN_STARTERS, 'find', 'eq', 'first', 'last', 'filter', 'children',
  'parent', 'parents', 'siblings', 'closest', 'next', 'nextAll', 'prev',
  'prevAll', 'shadow',
])
const VALUE_COMMANDS = new Set(['its', 'invoke', 'then', 'should', 'and'])
const LANGUAGE_CHAINS = new Set([
  'to', 'be', 'been', 'is', 'that', 'which', 'and', 'has', 'have',
  'with', 'at', 'of', 'same', 'but', 'does', 'still', 'also',
])

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary assertions on Cypress chainable objects',
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

    const bindings = new Map()

    // Direct method calls such as `chai.use(plugin)` are allowed; any other
    // reference to `chai` conservatively disables recognition.
    function isMethodCall({ identifier }) {
      const member = identifier.parent
      return member.type === 'MemberExpression' && member.object === identifier && !member.computed
        && member.parent.type === 'CallExpression' && member.parent.callee === member
    }

    // What the file does with the variable or global that `node` refers to,
    // computed once per binding rather than once per assertion.
    function resolve(node) {
      let variable = null
      for (let scope = sourceCode.getScope(node); scope && !variable; scope = scope.upper) {
        variable = scope.set.get(node.name)
      }
      const key = variable || node.name
      if (!bindings.has(key)) {
        // A name that no scope declares is an unconfigured global.
        const references = variable
          ? variable.references
          : sourceCode.scopeManager.globalScope.through.filter((reference) => reference.identifier.name === node.name)
        bindings.set(key, {
          defs: variable ? variable.defs : [],
          // The initializer of `const chai = require('chai')` does not count.
          written: references.some((reference) => reference.isWrite() && !reference.init),
          onlyCalled: references.every((reference) => reference.init || isMethodCall(reference)),
        })
      }
      return bindings.get(key)
    }

    // Like the other Cypress rules, allow unconfigured framework globals,
    // but not assignments to those names in this file.
    function isUnshadowed(node) {
      const { defs, written } = resolve(node)
      return defs.length === 0 && !written
    }

    function isChaiRequire(node) {
      return Boolean(node) && node.type === 'CallExpression' && !node.optional
        && node.callee.type === 'Identifier' && node.callee.name === 'require'
        && isUnshadowed(node.callee)
        && node.arguments.length === 1 && node.arguments[0].type === 'Literal'
        && node.arguments[0].value === 'chai'
    }

    // `import { 'expect' as expect }` and `{ 'expect': expect }` use a string
    // Literal where the usual form has an Identifier.
    function keyName(node) {
      return node.type === 'Identifier' ? node.name : node.value
    }

    // Whether the single definition of a local binding makes it Chai itself
    // (`wanted` is 'chai') or Chai's expect (`wanted` is 'expect').
    function isChaiDefinition(def, wanted) {
      if (def.type === 'ImportBinding') {
        // TypeScript's `import chai = require('chai')` is not supported.
        if (def.parent.type !== 'ImportDeclaration' || def.parent.source.value !== 'chai'
          || def.parent.importKind === 'type') return false
        return wanted === 'chai'
          ? ['ImportDefaultSpecifier', 'ImportNamespaceSpecifier'].includes(def.node.type)
          : def.node.type === 'ImportSpecifier' && def.node.importKind !== 'type'
            && keyName(def.node.imported) === 'expect'
      }

      if (def.type !== 'Variable' || def.node.type !== 'VariableDeclarator' || !isChaiRequire(def.node.init)) return false
      const id = def.node.id
      return wanted === 'chai'
        ? id === def.name
        : id.type === 'ObjectPattern' && id.properties.some((property) =>
          property.type === 'Property' && !property.computed
          && keyName(property.key) === 'expect' && property.value === def.name)
    }

    // Whether `node` (the `expect` in `expect(...)` or the `chai` in
    // `chai.expect(...)`) is Chai's: the global, or an import or require of
    // 'chai', that nothing in the file reassigns.
    function isChai(node, wanted) {
      const binding = resolve(node)
      if (binding[wanted] === undefined) {
        // `chai` may only be used for method calls. Anything else, such as
        // `chai.expect = custom` or `Object.assign(chai, custom)`, could
        // replace its expect.
        binding[wanted] = !binding.written && (wanted === 'expect' || binding.onlyCalled)
          && (binding.defs.length === 0
            || (binding.defs.length === 1 && isChaiDefinition(binding.defs[0], wanted)))
      }
      return binding[wanted]
    }

    function isChaiExpect(callee) {
      if (callee.type === 'Identifier') return callee.name === 'expect' && isChai(callee, 'expect')
      return callee.type === 'MemberExpression' && !callee.computed && !callee.optional
        && callee.property.name === 'expect'
        && callee.object.type === 'Identifier' && callee.object.name === 'chai'
        && isChai(callee.object, 'chai')
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
      // cy.find() and the other subject-requiring queries throw at runtime.
      // That is a different mistake, and `.should('exist')` would not fix it.
      if (!calls.length || !CHAIN_STARTERS.has(calls[0].name)) return null
      return calls
    }

    function isStaticSelector(node) {
      if (!node) return false
      const value = node.type === 'TemplateLiteral' && node.expressions.length === 0
        ? node.quasis[0].value.cooked
        : node.type === 'Literal' ? node.value : null
      return typeof value === 'string' && !value.startsWith('@')
    }

    function canFixQuery(calls) {
      // get('@alias') may yield arbitrary data, and a dynamic selector may
      // resolve to an alias. Neither is a proven DOM-query fix target.
      return calls.every(({ name, node }) =>
        QUERY_COMMANDS.has(name) && (name !== 'get' || isStaticSelector(node.arguments[0])))
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
        if (node.optional || node.arguments.length !== 1) return
        if (!isChaiExpect(node.callee)) return
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
