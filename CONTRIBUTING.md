# Contributing to cypress-io/eslint-plugin-cypress

Thanks for taking the time to contribute! :smile:

To add a new rule:
  * Fork and clone this repository
  * Generate a new rule (a [yeoman generator](https://github.com/eslint/generator-eslint) is available)
  * Write test scenarios then implement logic
  * Describe the rule in the generated `docs` file
  * Run `npm test` to run [Jest](https://jestjs.io/) or
  * Run `npm start` to run [Jest](https://jestjs.io/) in [watchAll](https://jestjs.io/docs/cli#--watchall) mode where it remains active and reruns when source changes are made
  * Make sure all tests are passing
  * Add the rule to the [README](README.md) file
  * Create a PR

Use the following commit message conventions: https://github.com/semantic-release/semantic-release#commit-message-format
