/**
 * @param {import('eslint').Rule.RuleContext} context
 * @param {@type {import('eslint').Rule.RuleMetaData['schema']}} schema
 * @returns {Record<string, any>}
 */
const getDefaultOptions = (schema, context) => {
  return Object.entries(schema.properties).reduce((acc, [key, value]) => {
    if (!(value.default in value)) return acc

    return {
      ...acc,
      [key]: value.default,
    }
  }, context.options[0] || {})
}

module.exports = {
  getDefaultOptions,
}
