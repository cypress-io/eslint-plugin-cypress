module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        const testDescriptions = ['context', 'describe', 'it'];
        const forbiddenValues = ['only', 'skip'];

        if (
          callee.type === 'MemberExpression' &&
          testDescriptions.includes(callee.object.name) &&
          forbiddenValues.includes(callee.property.name)
        ) {
          const filePath = context.getFilename();

          if (filePath.match(/\.cytest\.tsx$|cypress\/integration\/.*\.spec\.ts$/)) {
            context.report({
              node: node,
              message: 'Do not use .only or .skip in tests',
            });
          }
        }
      },
    };
  },
};
