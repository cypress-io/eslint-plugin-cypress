import pluginCypress from 'eslint-plugin-cypress'
export default [
  pluginCypress.configs.recommended,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'off'
    }
  }
]
