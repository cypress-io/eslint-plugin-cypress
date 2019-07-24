/**
* @fileoverview Prevent use of exclusive tests (i.e. .only())
* @author Rory Haddon
*/
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent use of exclusive tests (i.e. .only())',
      category: 'Warning',
      recommended: true,
    },
    fixable: null, // or 'code' or 'whitespace'
    schema: [
      // fill in your schema
    ],
    messages: {
      exclusiveTest: 'Unexpected exclusive Cypress test',
    },
  },

  create: (context) => {
    const testFunctions = new Set(['describe', 'context', 'it'])

    const matchesTestFunction = (object) => object && testFunctions.has(object.name)

    const isPropertyNamedOnly = (property) => {
      return property && (property.name === 'only' || property.value === 'only')
    }

    const isCallToTestOnlyFunction = (callee) => {
      return matchesTestFunction(callee.object) && isPropertyNamedOnly(callee.property)
    }

    return {
      CallExpression: (node) => {
        const { callee } = node

        if (callee.type === 'MemberExpression') {
          if (
            callee.object.type === 'MemberExpression' &&
            isCallToTestOnlyFunction(callee.object)
          ) {
            context.report({
              messageId: 'exclusiveTest',
              node: callee.object.property,
            })

            return
          }

          if (isCallToTestOnlyFunction(callee)) {
            context.report({ messageId: 'exclusiveTest', node: callee.property })

            return
          }
        }
      },
    }
  },
}
