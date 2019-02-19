const globals = require('globals')

module.exports = {
  rules: {
    'no-assigning-return-values': require('./lib/rules/no-assigning-return-values'),
    'no-unnecessary-waiting': require('./lib/rules/no-unnecessary-waiting'),
    'assertion-before-screenshot': require('./lib/rules/assertion-before-screenshot'),
  },
  configs: {
    recommended: require('./lib/config/recommended'),
  },
  environments: {
    globals: {
      globals: Object.assign(globals.browser, globals.mocha, {
        cy: false,
        Cypress: false,
        expect: false,
        assert: false,
        chai: false,
      }),
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
    },
  },
}
