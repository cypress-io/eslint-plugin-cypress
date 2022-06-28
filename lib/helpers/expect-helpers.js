/**
 * Return the argument passed to the `expect()` call in
 * `expectExpression`. `expectExpression` should be an expectation
 * (e.g., `expect(foo).to.be.true`).
 */
function getExpectArgument (expectExpression, context) {
  if (expectExpression.type === 'MemberExpression') {
    return getExpectArgument(expectExpression.object, context)
  }

  if (expectExpression.type !== 'CallExpression' || expectExpression.callee.name !== 'expect') {
    return undefined
  }

  // Check expect() takes 1 and only 1 argument:
  if (expectExpression.arguments.length !== 1) return undefined

  return expectExpression.arguments[0].name
}

const expectRegexp = /^expect\([^)]*\)\.(not\.)?(?:to\.)?(.*)$/s

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
    case 'CallExpression':
      assertionArgumentString = `, ${ sourceCode.getText(expectNode.arguments[0])}`
      assertion = expectNode.callee
      break
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

module.exports = {
  getExpectArgument,
  convertExpectToShould,
}
