// eslint-plugin-cypress/flat is deprecated and is identical to
// eslint-plugin-cypress
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  pluginCypress.configs.recommended,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
]
