const globals = require('globals')

module.exports = {
  environments: {
    globals: {
      globals: Object.assign(globals.browser, globals.mocha, {
        cy: false,
        Cypress: false,
        expect: false,
        assert: false,
      }),
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
    },
  },
}
