const globals = require('globals')
const { name, version } = require('../package.json')

const plugin = {
  meta: { name, version },
  configs: {},
  rules: {
    'no-assigning-return-values': require('./rules/no-assigning-return-values'),
    'unsafe-to-chain-command': require('./rules/unsafe-to-chain-command'),
    'no-unnecessary-waiting': require('./rules/no-unnecessary-waiting'),
    'no-async-before': require('./rules/no-async-before'),
    'no-async-tests': require('./rules/no-async-tests'),
    'assertion-before-screenshot': require('./rules/assertion-before-screenshot'),
    'require-data-selectors': require('./rules/require-data-selectors'),
    'no-force': require('./rules/no-force'),
    'no-pause': require('./rules/no-pause'),
    'no-debug': require('./rules/no-debug'),
  },
}

const commonGlobals =
  Object.assign({
    cy: false,
    Cypress: false,
    expect: false,
    assert: false,
    chai: false,
  }, globals.browser, globals.mocha)

const commonLanguageOptions = {
  ecmaVersion: 2019,
  sourceType: 'module'
}

Object.assign(plugin.configs, {
  globals: {
    name: 'cypress/globals',
    plugins: {
      cypress: plugin
    },
    languageOptions: {
      globals:
        commonGlobals,
      ...commonLanguageOptions
    }
  }
})

Object.assign(plugin.configs, {
  recommended: {
    name: 'cypress/recommended',
    plugins: {
      cypress: plugin
    },
    rules: {
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-async-tests': 'error',
      'cypress/unsafe-to-chain-command': 'error',
    },
    languageOptions: {
      globals:
        commonGlobals,
      ...commonLanguageOptions
    }
  }
})

module.exports = plugin
