'use strict'

const targetCalleeNames = ['it', 'specify', 'context', 'describe']

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
      emptyTags: 'Tags must not be empty string or an empty array',
    },
  },

  create(context) {
    function isTargetTestCallee(callee) {
      if (callee.type === 'Identifier') {
        return targetCalleeNames.includes(callee.name)
      }
      if (callee.type === 'MemberExpression'
        && !callee.computed
        && callee.object.type === 'Identifier'
        && targetCalleeNames.includes(callee.object.name)
        && callee.property.type === 'Identifier'
        && (callee.property.name === 'only' || callee.property.name === 'skip')) {
        return true
      }
      return false
    }

    function getOptionsArg(node) {
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

        if (tagsNode.type === 'ArrayExpression') {
          if (tagsNode.elements.length === 0) {
            context.report({ node: tagsNode, messageId: 'emptyTags' })
            return
          }
          const hasValidTag = tagsNode.elements.some(function (el) {
            return el && el.type === 'Literal' && typeof el.value === 'string' && el.value.length > 0
          })
          if (!hasValidTag) {
            context.report({ node: tagsNode, messageId: 'emptyTags' })
            return
          }
        }
        if (tagsNode.type === 'Literal' && typeof tagsNode.value === 'string') {
          if (tagsNode.value.length === 0) {
            context.report({ node: tagsNode, messageId: 'emptyTags' })
            return
          }
        }
      },
    }
  },
}
