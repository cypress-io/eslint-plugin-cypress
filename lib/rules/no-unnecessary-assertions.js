'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// Query commands that yield a Cypress chainable. `expect()` on one of these asserts
// against the chainable object itself, never against the DOM it will later resolve.
const QUERY_COMMANDS = [
  'get', 'find', 'contains', 'eq', 'first', 'last', 'filter', 'children',
  'parent', 'parents', 'siblings', 'closest', 'next', 'nextAll', 'prev',
  'prevAll', 'focused', 'root', 'shadow',
]

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow assertions on a Cypress chainable that can never fail',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-assertions.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: 'This assertion can never fail: `{{ subject }}` yields a Cypress chainable, which {{ reason }}. Assert the element instead, e.g. `{{ subject }}.should(\'be.visible\')`.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // Collect property names along a member/call chain and return its root node,
    // so `cy.get('a').find('b')` yields names ['find', 'get'] and root `cy`.
    function chainInfo(node) {
      const names = []
      let current = node

      while (current) {
        if (current.type === 'CallExpression') {
          current = current.callee
        }
        else if (current.type === 'MemberExpression') {
          if (!current.computed && current.property.type === 'Identifier') {
            names.push(current.property.name)
          }

          current = current.object
        }
        else {
          break
        }
      }

      return { names, root: current }
    }

    // True when the chain's LAST call is a query, i.e. it still yields elements.
    // `cy.get('.a').its('length')` is rooted at a query but yields a number, so the
    // element-oriented autofix must not be applied to it.
    function yieldsElements(node) {
      if (!node || node.type !== 'CallExpression') return false
      if (node.callee.type !== 'MemberExpression' || node.callee.computed) return false
      if (node.callee.property.type !== 'Identifier') return false

      return QUERY_COMMANDS.includes(node.callee.property.name)
    }

    // True for an inline `cy.<query>()` chain. Only inline chains are considered:
    // a bare identifier could hold anything, and flagging those would misfire on
    // ordinary values (see the `expect(count).to.exist` valid case).
    function isCypressQuery(node) {
      if (!node || node.type !== 'CallExpression') return false

      const { names, root } = chainInfo(node)

      if (!(root && root.type === 'Identifier' && root.name === 'cy')) return false

      return names.some((name) => QUERY_COMMANDS.includes(name))
    }

    // Walk UP from `expect(...)` through the chai chain, collecting property names
    // and the arguments of a terminal call (`.to.be.a('object')`).
    function chaiChain(expectNode) {
      const props = []
      let callArguments = null
      let current = expectNode
      let top = expectNode
      let parent = expectNode.parent

      while (parent) {
        if (parent.type !== 'MemberExpression' || parent.object !== current) break

        if (!parent.computed && parent.property.type === 'Identifier') {
          props.push(parent.property.name)
        }

        current = parent
        top = parent
        parent = parent.parent

        if (parent && parent.type === 'CallExpression' && parent.callee === current) {
          if (parent.arguments.length) callArguments = parent.arguments
          current = parent
          top = parent
          parent = parent.parent
        }
      }

      return { props, callArguments, top }
    }

    // Which chai terminals are satisfied by any object, and why.
    function vacuousReason(props, callArguments) {
      const negated = props.includes('not')
      const terminal = props[props.length - 1]
      const firstArgument = callArguments && callArguments[0]

      if (!negated && terminal === 'exist') return 'always exists'
      if (!negated && terminal === 'ok') return 'is always truthy'
      if (negated && terminal === 'null') return 'is never null'
      if (negated && terminal === 'undefined') return 'is never undefined'

      if (
        !negated
        && (terminal === 'a' || terminal === 'an')
        && firstArgument
        && firstArgument.type === 'Literal'
        && /object/i.test(String(firstArgument.value))
      ) {
        return 'is always an object'
      }

      return null
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {

      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'expect') return
        if (node.arguments.length !== 1) return

        const subject = node.arguments[0]

        if (!isCypressQuery(subject)) return

        const { props, callArguments, top } = chaiChain(node)

        if (!props.length) return

        const reason = vacuousReason(props, callArguments)

        if (!reason) return

        const subjectText = sourceCode.getText(subject)

        context.report({
          node: top,
          messageId: 'unexpected',
          data: { subject: subjectText, reason },
          fix(fixer) {
            // Fix only the unambiguous case. Bail when:
            // - the assertion is not a standalone statement (rewriting a value-position
            //   `expect()` would change what the surrounding expression evaluates to)
            // - a comment sits between `expect(...)` and the chai chain, since the
            //   rewrite would delete it
            if (!top.parent || top.parent.type !== 'ExpressionStatement') return null

            // Only rewrite when the chain still yields elements. `.its()` / `.invoke()`
            // yield a value, and `.should('exist')` on those would be nonsense.
            if (!yieldsElements(subject)) return null

            if (
              sourceCode.getCommentsInside(top).length
              > sourceCode.getCommentsInside(subject).length
            ) {
              return null
            }

            // `should('exist')`, not `should('be.visible')`: the original asserted
            // existence, and a hidden-but-present element must not start failing
            // just because someone ran --fix.
            return fixer.replaceText(top, `${subjectText}.should('exist')`)
          },
        })
      },

    }
  },
}
