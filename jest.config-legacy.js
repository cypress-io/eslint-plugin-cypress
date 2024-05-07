const { defaults } = require('jest-config')

module.exports = {
  testMatch: ['**/tests-legacy/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '.history'],
}
