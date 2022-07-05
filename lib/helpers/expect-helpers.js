/**
 * Return the argument passed to the `expect()` call in
 * `expectExpression`. `expectExpression` should be an expectation
 * (e.g., `expect(foo).to.be.true`).
 */

function getExpectArgument (expectExpression) {
  let initialReceiver = getInitialReceiver(expectExpression)

  if (initialReceiver.type !== 'CallExpression' || initialReceiver.callee.name !== 'expect') {
    return undefined
  }

  // Check expect() takes 1 and only 1 argument:
  if (initialReceiver.arguments.length !== 1) return undefined

  return initialReceiver.arguments[0].name
}

/**
 * Return the name of the first member of a property-access
 * chain. E.g., return "cy" in `cy.get("foo").bar`.
 */
function getInitialReceiver (node) {
  switch (node.type) {
    case 'MemberExpression':
      return getInitialReceiver(node.object)
    case 'CallExpression':
      return node.callee.type === 'MemberExpression'
        ? getInitialReceiver(node.callee)
        : node
    default:
      return node
  }
}

const expectRegexp = /^expect\([^)]*\)\s*\.\s*(not\s*\.)?\s*(?:to\s*\.)?\s*(.*)$/s

/**
 * Convert `expectNode`, a call to `expect()` with some chainers into
 * a call to `should()`. For example, `expect(foo).to.equal(2)` is
 * converted into ".should('equal',2)". It is the responsibility of
 * the function's caller to make sure the argument to `expect()` is
 * the receiver of the call to `should()`.
 */
function convertExpectToShould (expectNode, context) {
  let sourceCode = context.getSourceCode()

  let assertionArgumentString
  let assertion

  switch (expectNode.type) {
    case 'CallExpression': {
      let argumentsAsString = convertNodesToString(expectNode.arguments, context)

      assertionArgumentString = argumentsAsString ? `, ${argumentsAsString}` : ''
      assertion = expectNode.callee

      break
    }
    case 'MemberExpression':
      assertionArgumentString = ''
      assertion = expectNode
      break
    default:
      return undefined
  }

  let assertionWithExpectString = sourceCode.getText(assertion).replace(/\n/g, '')
  let [_, isNegated, assertionWithoutExpectString] = assertionWithExpectString.match(expectRegexp)
  let assertionString = isNegated ? `not.${assertionWithoutExpectString}` : assertionWithoutExpectString

  return `.should("${assertionString}"${assertionArgumentString})`
}

/**
 * Convert `nodes`, an array of Node, into a comma-separated string.
 */
function convertNodesToString (nodes, context) {
  let result = ''
  let sourceCode = context.getSourceCode()

  for (let i = 0; i < nodes.length; ++i) {
    result += sourceCode.getText(nodes[i])

    if (i !== nodes.length - 1) {
      result += ','
    }
  }

  return result
}

const chainerProperties = [
  'called',
  'calledOnce',
  'calledThrice',
  'calledTwice',
  'calledWithNew',
]

const chainerMethods = [
  'callCount',
  'calledAfter',
  'calledBefore',
  'calledOn',
  'calledOnceWith',
  'calledOnceWithExactly',
  'calledWith',
  'calledWithExactly',
  'calledWithMatch',
  'returned',
  'thrown',
]

module.exports = {
  getExpectArgument,
  getInitialReceiver,
  convertExpectToShould,
  chainerMethods,
  chainerProperties,
}
