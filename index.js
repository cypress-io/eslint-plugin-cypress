module.exports = {
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  globals: {
    cy: true,
    Cypress: true,

    describe: true,
    context: true,
    it: true,
    before: true,
    beforeEach: true,
    after: true,
    afterEach: true,
    expect: true,
    assert: true,
  }
}
