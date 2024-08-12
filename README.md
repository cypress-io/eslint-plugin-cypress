# Cypress ESLint Plugin [![CircleCI](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master)

An [ESLint](https://eslint.org) plugin for your [Cypress](https://cypress.io) tests.

Note: If you installed ESLint globally then you must also install `eslint-plugin-cypress` globally.

## Installation

Prerequisites: [ESLint](https://www.npmjs.com/package/eslint) `v7`, `v8` or `v9`.
This plugin supports the use of [Flat config files](https://eslint.org/docs/latest/use/configure/configuration-files) with ESLint `8.57.0` and above.

```sh
npm install eslint-plugin-cypress --save-dev
```
or
```sh
yarn add eslint-plugin-cypress --dev
```

## Deprecations

The use of ESLint `v7` with `eslint-plugin-cypress` is deprecated and support will be removed in a future version of this plugin. ESLint `v7` reached end-of-life on Apr 9, 2022 and users are encouraged to migrate to ESLint `v9`. See [ESLint Version Support](https://eslint.org/version-support/) for ESLint's current release lines.

## Usage

If you are using ESLint `v7` or `v8`, then add an `.eslintrc.json` file to the root directory of your Cypress project with the contents shown below. You can continue to use this format with ESLint `v9` if you set the `ESLINT_USE_FLAT_CONFIG` environment variable to `false` (see [ESLint v9 > Configuration Files (Deprecated)](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated).

ESLint `v9` uses a [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files) format with filename `eslint.config.*js` by default. Please refer to [additional Flat config installation and configuration details](FLAT-CONFIG.md). (You may also use this with ESLint `8.57.0`.)

```json
{
  "plugins": [
    "cypress"
  ]
}
```

You can add rules:

```json
{
  "rules": {
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error",
    "cypress/no-async-before": "error",
    "cypress/no-pause": "error",
    "cypress/no-debug": "error"
  }
}
```

You can allow certain globals provided by Cypress:

```json
{
  "env": {
    "cypress/globals": true
  }
}
```

## Recommended configuration

Use the recommended configuration and you can forego configuring _plugins_, _rules_, and _env_ individually. See below for which rules are included.

```json
{
  "extends": [
    "plugin:cypress/recommended"
  ]
}
```

## Disable rules

You can disable specific rules per file, for a portion of a file, or for a single line.

Disable the `cypress/no-unnecessary-waiting` rule for the entire file by placing this at the start of the file:

```js
/* eslint-disable cypress/no-unnecessary-waiting */
```

Disable the `cypress/no-unnecessary-waiting` rule for only a portion of the file:

```js
it('waits for a second', () => {
  ...
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
  /* eslint-enable cypress/no-unnecessary-waiting */
  ...
})
```

Disable the `cypress/no-unnecessary-waiting` rule for a specific line:

```js
it('waits for a second', () => {
  ...
  cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
  ...
})
```

You can also disable a rule for the next line:

```js
it('waits for a second', () => {
  ...
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000)
  ...
})
```

For more, see the [ESLint rules](https://eslint.org/docs/user-guide/configuring/rules) documentation.

## Rules

These rules enforce some of the [best practices recommended for using Cypress](https://on.cypress.io/best-practices).

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.

| Name                                                                     | Description                                                | 💼 |
| :----------------------------------------------------------------------- | :--------------------------------------------------------- | :- |
| [assertion-before-screenshot](docs/rules/assertion-before-screenshot.md) | require screenshots to be preceded by an assertion         |    |
| [no-assigning-return-values](docs/rules/no-assigning-return-values.md)   | disallow assigning return values of `cy` calls             | ✅  |
| [no-async-before](docs/rules/no-async-before.md)                         | disallow using `async`/`await` in Cypress `before` methods |    |
| [no-async-tests](docs/rules/no-async-tests.md)                           | disallow using `async`/`await` in Cypress test cases       | ✅  |
| [no-debug](docs/rules/no-debug.md)                                       | disallow using `cy.debug()` calls                          |    |
| [no-force](docs/rules/no-force.md)                                       | disallow using `force: true` with action commands          |    |
| [no-pause](docs/rules/no-pause.md)                                       | disallow using `cy.pause()` calls                          |    |
| [no-unnecessary-waiting](docs/rules/no-unnecessary-waiting.md)           | disallow waiting for arbitrary time periods                | ✅  |
| [require-data-selectors](docs/rules/require-data-selectors.md)           | require `data-*` attribute selectors                       |    |
| [unsafe-to-chain-command](docs/rules/unsafe-to-chain-command.md)         | disallow actions within chains                             | ✅  |

<!-- end auto-generated rules list -->

## Mocha and Chai

Cypress is built on top of [Mocha](https://on.cypress.io/guides/references/bundled-libraries#Mocha) and [Chai](https://on.cypress.io/guides/references/bundled-libraries#Chai). See the following sections for information on using ESLint plugins [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) and [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) together with `eslint-plugin-cypress`.

## Mocha `.only` and `.skip`

During test spec development, [Mocha exclusive tests](https://mochajs.org/#exclusive-tests) `.only` or [Mocha inclusive tests](https://mochajs.org/#inclusive-tests) `.skip` may be used to control which tests are executed, as described in the Cypress documentation [Excluding and Including Tests](https://on.cypress.io/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests). To apply corresponding rules, you can install and use [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha). The rule [mocha/no-exclusive-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-exclusive-tests.md) detects the use of `.only` and the [mocha/no-skipped-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-skipped-tests.md) rule detects the use of `.skip`:

```sh
npm install --save-dev eslint-plugin-mocha
```

In your `.eslintrc.json`:

```json
{
  "plugins": [
    "cypress",
    "mocha"
  ],
  "rules": {
    "mocha/no-exclusive-tests": "warn",
    "mocha/no-skipped-tests": "warn"
  }
}
```

Or you can simply use the `cypress/recommended` and `mocha/recommended` configurations together, for example:

```json
{
  "extends": [
    "plugin:cypress/recommended",
    "plugin:mocha/recommended"
  ]
}
```

## Chai and `no-unused-expressions`

Using an assertion such as `expect(value).to.be.true` can fail the ESLint rule `no-unused-expressions` even though it's not an error in this case. To fix this, you can install and use [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly).

```sh
npm install --save-dev eslint-plugin-chai-friendly
```

In your `.eslintrc.json`:

```json
{
  "plugins": [
    "cypress",
    "chai-friendly"
  ],
  "rules": {
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2
  }
}
```

Or you can simply add its `recommended` config:

```json
{
  "extends": ["plugin:chai-friendly/recommended"]
}
```

## Contributing

Please see our [Contributing Guideline](./CONTRIBUTING.md) which explains how to contribute rules or other fixes and features to the repo.
