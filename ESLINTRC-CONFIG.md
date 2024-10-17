# Cypress ESLint Plugin - Legacy Config

This document supplements the [README](./README.md) document and describes how to use the Cypress ESLint Plugin (`eslint-plugin-cypress`) in a [deprecated ESLint legacy config environment](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated). The use of flat configurations with this plugin is described in the [README](./README.md) document.

Usage with ESLint `9.x` is described.

## Deprecations

The use of `eslintrc` configurations with `eslint-plugin-cypress` is deprecated and support will be removed in a future version of this plugin. This is tied in to the ESLint announcement in the blog post [Flat config rollout plans](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) from October 2023 which describes that the `eslintrc` configuration system is planned to be removed in the future ESLint `v10.0.0`. Users are encouraged to migrate to using a [flat configuration](https://eslint.org/docs/latest/use/configure/configuration-files).

## Installation

Use a minimum ESLint `9.x`.

```shell
npm install eslint eslint-plugin-cypress --save-dev
```

or

```shell
yarn add eslint eslint-plugin-cypress --dev
```

## Usage

To use a deprecated configuration with ESLint `v9`, such as `.eslintrc.json`, you must set the `ESLINT_USE_FLAT_CONFIG` environment variable to `false` (see [ESLint v9 > Configuration Files (Deprecated)](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated)). The following examples use `json` format for the content of the configuration file:

```json
{
  "plugins": [
    "cypress"
  ]
}
```

You can add rules - see [Rules](./README.md#rules) for a list of the available rules:

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

Use the recommended configuration and you can forego configuring _plugins_, _rules_, and _env_ individually. See [Rules](./README.md#rules) for which rules are included in the recommended configuration.

```json
{
  "extends": [
    "plugin:cypress/recommended"
  ]
}
```

## Rules

See the [Rules](./README.md#rules) list in the main [README](./README.md) document.

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
