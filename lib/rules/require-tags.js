'use strict'

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require tests to declare tags in the options argument',
      recommended: false,
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/require-tags.md',
    },
    schema: [],
    messages: {
      missingTags: 'Add tags to the test options, e.g. it("name", { tags: ["smoke"] }, fn)',
      emptyTags: 'Tags array must not be empty',
    },
  },

  create(context) {
    function isTargetTestCallee(callee) {
      // Matches: it(), test(), specify(), and their .only/.skip variants
      if (callee.type === 'Identifier') {
        return callee.name === 'it' || callee.name === 'test' || callee.name === 'specify'
      }
      if (callee.type === 'MemberExpression'
        && !callee.computed
        && callee.object.type === 'Identifier'
        && (callee.object.name === 'it' || callee.object.name === 'test' || callee.object.name === 'specify')
        && callee.property.type === 'Identifier'
        && (callee.property.name === 'only' || callee.property.name === 'skip')) {
        return true
      }
      return false
    }

    function getOptionsArg(node) {
      // it(title, options, fn)
      if (!node.arguments || node.arguments.length < 2) return null
      const second = node.arguments[1]
      return second && second.type === 'ObjectExpression' ? second : null
    }

    function findTagsProperty(objectExpression) {
      for (const prop of objectExpression.properties) {
        if (prop && prop.type === 'Property') {
          const key = prop.key
          if ((key.type === 'Identifier' && key.name === 'tags')
            || (key.type === 'Literal' && key.value === 'tags')) {
            return prop.value
          }
        }
      }
      return null
    }

    function isNonEmptyStringArray(node) {
      if (node.type === 'ArrayExpression') {
        if (node.elements.length === 0) return false
        return node.elements.every(function (el) {
          return el && el.type === 'Literal' && typeof el.value === 'string' && el.value.length > 0
        })
      }
      if (node.type === 'Literal') {
        return typeof node.value === 'string' && node.value.length > 0
      }
      return false
    }

    return {
      CallExpression(node) {
        if (!isTargetTestCallee(node.callee)) return

        const optionsArg = getOptionsArg(node)
        if (!optionsArg) {
          context.report({ node, messageId: 'missingTags' })
          return
        }

        const tagsNode = findTagsProperty(optionsArg)
        if (!tagsNode) {
          context.report({ node: optionsArg, messageId: 'missingTags' })
          return
        }

        if (!isNonEmptyStringArray(tagsNode)) {
          // If it's an array but empty, report emptyTags for clarity
          if (tagsNode.type === 'ArrayExpression' && tagsNode.elements.length === 0) {
            context.report({ node: tagsNode, messageId: 'emptyTags' })
          }
        }
      },
    }
  },
}
