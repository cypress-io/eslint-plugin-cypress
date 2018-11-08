/**
 * @fileoverview Prevent assigning return value of cy calls
 * @author Elad Shahar
 */

'use strict';

module.exports = {
  meta: {
    docs: {
      description: 'Prevent assigning return values of cy calls',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://docs.cypress.io/guides/references/best-practices.html#Assigning-Return-Values'
    },
    schema: [],
    messages: {
      unexpected: 'Do not assign the return value of a Cypress command'
    }
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.declarations.some(isCypressCommandDeclaration)) {
          context.report({ node, messageId: 'unexpected' });
        }
      }
    };
  }
};

function isCypressCommandDeclaration(declarator) {
  if (!declarator)             { return; }
  if (!declarator.init)        { return; }
  if (!declarator.init.callee) { return; }

  let object = declarator.init.callee.object;

  if (!object)                 { return; }

  while (object.callee) {
    object = object.callee.object;
    if (!object) {
      return;
    }
  }

  return object.name === 'cy';
}
