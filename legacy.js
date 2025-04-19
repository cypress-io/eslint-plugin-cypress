const globals = require('globals')

module.exports = {
  rules: {
    'no-assigning-return-values': require('./lib/rules/no-assigning-return-values'),
    'unsafe-to-chain-command': require('./lib/rules/unsafe-to-chain-command'),
    'no-unnecessary-waiting': require('./lib/rules/no-unnecessary-waiting'),
    'no-async-before': require('./lib/rules/no-async-before'),
    'no-async-tests': require('./lib/rules/no-async-tests'),
    'assertion-before-screenshot': require('./lib/rules/assertion-before-screenshot'),
    'require-data-selectors': require('./lib/rules/require-data-selectors'),
    'no-force': require('./lib/rules/no-force'),
    'no-pause': require('./lib/rules/no-pause'),
    'no-debug': require('./lib/rules/no-debug'),
    'no-xpath': require('./lib/rules/no-xpath'),
    'no-chained-get': require('./lib/rules/no-chained-get'),
  },
  configs: {
    recommended: require('./lib/config/recommended'),
  },
  environments: {
    globals: {
      globals: Object.assign({
        cy: false,
        Cypress: false,
        expect: false,
        assert: false,
        chai: false,
      }, globals.browser, globals.mocha),
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
    },
  },
}
