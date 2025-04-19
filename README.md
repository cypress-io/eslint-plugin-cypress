# Cypress ESLint Plugin [![CircleCI](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/eslint-plugin-cypress/tree/master)

An [ESLint](https://eslint.org) plugin for your [Cypress](https://cypress.io) tests.

Note: If you installed ESLint globally then you must also install `eslint-plugin-cypress` globally.

## Installation

Prerequisites: [ESLint](https://www.npmjs.com/package/eslint) `v9`. Lower versions are no longer supported.

```sh
npm install eslint eslint-plugin-cypress --save-dev
```
or
```sh
yarn add eslint eslint-plugin-cypress --dev
```

## Usage

ESLint `v9` uses a [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files) format with filename `eslint.config.*js` by default. For instructions on using a deprecated [eslintrc-type](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated) config file from previous ESLint versions, please refer to the [ESLINTRC-CONFIG](./ESLINTRC-CONFIG.md) document.

To set up a flat configuration, add a file `eslint.config.mjs` to the root directory of your Cypress project and include the following instructions to import the available flat configurations using:

```shell
import pluginCypress from 'eslint-plugin-cypress/flat'
```

## Configurations

There are two specific flat configurations available:

| Configuration         | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configs.globals`     | defines globals `cy`, `Cypress`, `expect`, `assert` and `chai` used in Cypress test specs as well as `globals.browser` and `globals.mocha` from [globals](https://www.npmjs.com/package/globals). This version no longer specifies `languageOptions` for `ecmaVersion` and `sourceType` - see ESLint [JavaScript languageOptions](https://eslint.org/docs/latest/use/configure/language-options#specifying-javascript-options). There are no default rules enabled in this configuration. |
| `configs.recommended` | enables [recommended Rules](#rules). It includes also `configs.global` (see above).                                                                                                                                                                                                                                                                                                                                                                                               |

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
| [no-chained-get](docs/rules/no-chained-get.md)                           | disallow chain of `cy.get()` calls                         |    |
| [no-debug](docs/rules/no-debug.md)                                       | disallow using `cy.debug()` calls                          |    |
| [no-force](docs/rules/no-force.md)                                       | disallow using `force: true` with action commands          |    |
| [no-pause](docs/rules/no-pause.md)                                       | disallow using `cy.pause()` calls                          |    |
| [no-unnecessary-waiting](docs/rules/no-unnecessary-waiting.md)           | disallow waiting for arbitrary time periods                | ✅  |
| [no-xpath](docs/rules/no-xpath.md)                                       | disallow using `cy.xpath()` calls                          |    |
| [require-data-selectors](docs/rules/require-data-selectors.md)           | require `data-*` attribute selectors                       |    |
| [unsafe-to-chain-command](docs/rules/unsafe-to-chain-command.md)         | disallow actions within chains                             | ✅  |

<!-- end auto-generated rules list -->

## Usage examples

In the following sections, different examples of possible configuration file contents are given, together with some brief explanations. Adapt these examples according to your needs.

### Cypress

All rules from `eslint-plugin-cypress` are available through `eslint-plugin-cypress/flat` and can be individually activated.
- [cypress/unsafe-to-chain-command](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/unsafe-to-chain-command.md) is activated and set to `error`

```js
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  {
    plugins: {
      cypress: pluginCypress
    },
    rules: {
      'cypress/unsafe-to-chain-command': 'error'
    }
  }
]
```

### Cypress recommended

The `eslint-plugin-cypress` [recommended rules](#rules) `configs.recommended` are activated, except for
- [cypress/no-unnecessary-waiting](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-waiting.md) which is set to `off`

```js
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  pluginCypress.configs.recommended,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'off'
    }
  }
]
```

### Cypress globals

The `configs.globals` are activated.

```js
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  pluginCypress.configs.globals
]
```

## Disable rules

You can disable specific rules per file, for a portion of a file, or for a single line. See the [ESLint rules](https://eslint.org/docs/latest/use/configure/rules#disabling-rules) documentation. For example ...

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

## Mocha and Chai

Cypress is built on top of [Mocha](https://on.cypress.io/guides/references/bundled-libraries#Mocha) and [Chai](https://on.cypress.io/guides/references/bundled-libraries#Chai). See the following sections for information on using ESLint plugins [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) and [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) together with `eslint-plugin-cypress`.

## Mocha `.only` and `.skip`

During test spec development, [Mocha exclusive tests](https://mochajs.org/#exclusive-tests) `.only` or [Mocha inclusive tests](https://mochajs.org/#inclusive-tests) `.skip` may be used to control which tests are executed, as described in the Cypress documentation [Excluding and Including Tests](https://on.cypress.io/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests). To apply corresponding rules, you can install and use [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha). The rule [mocha/no-exclusive-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-exclusive-tests.md) detects the use of `.only` and the [mocha/no-skipped-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-skipped-tests.md) rule detects the use of `.skip`.

### Cypress and Mocha recommended

[eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) is added to the example [Cypress recommended](#cypress-recommended). This plugin offers a flat file recommended option `configs.flat.recommended`.

The settings for individual `mocha` rules from the `configs.flat.recommended` option are changed.
- [mocha/no-exclusive-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-exclusive-tests.md) and [mocha/no-skipped-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-skipped-tests.md) are set to `error` instead of `warn`
- [mocha/no-mocha-arrows](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-mocha-arrows.md) is set to `off` instead of `error`

```shell
npm install eslint-plugin-mocha@^10.5.0 --save-dev
```

```js
import pluginMocha from 'eslint-plugin-mocha'
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  pluginMocha.configs.flat.recommended,
  pluginCypress.configs.recommended,
  {
    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-skipped-tests': 'error',
      'mocha/no-mocha-arrows': 'off',
      'cypress/no-unnecessary-waiting': 'off'
    }
  }
]
```

### Cypress and Chai recommended

Using an assertion such as `expect(value).to.be.true` can fail the ESLint rule `no-unused-expressions` even though it's not an error in this case. To fix this, you can install and use [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly).

[eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) is combined with the Cypress plugin `eslint-plugin-cypress`.

The recommended rules for both plugins are used: `pluginCypress.configs.recommended` and `pluginChaiFriendly.configs.recommendedFlat`:

```shell
npm install eslint-plugin-chai-friendly@^1.0.1 --save-dev
```

```js
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginChaiFriendly from 'eslint-plugin-chai-friendly'
export default [
  pluginCypress.configs.recommended,
  pluginChaiFriendly.configs.recommendedFlat,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  }
]
```

## Contributing

Please see our [Contributing Guideline](./CONTRIBUTING.md) which explains how to contribute rules or other fixes and features to the repo.
