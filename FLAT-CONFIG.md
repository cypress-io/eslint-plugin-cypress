# Cypress ESLint Plugin - Flat Config

This document supplements the [README](README.md) document and describes how to use the Cypress ESLint Plugin (`eslint-plugin-cypress`) in an ESLint flat config environment.

Usage with ESLint `8.57.0` and ESLint `9.x` is described.

## Introduction

[ESLint v9.0.0](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) was released on April 5, 2024, establishing flat config as the default for this version.

Previously, ESLint had announced in their blog post [Flat config rollout plans](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) in October 2023 that flat config was planned to be the default in ESLint `v9.0.0` and that the eslintrc configuration system is planned to be removed in the future ESLint `v10.0.0`.

Cypress ESLint Plugin (`eslint-plugin-cypress`) in release [3.2.0](https://github.com/cypress-io/eslint-plugin-cypress/releases/tag/v3.2.0) offered the first support of ESLint `9.x` flat config files using the [Backwards compatibility utility](https://eslint.org/blog/2022/08/new-config-system-part-2/#backwards-compatibility-utility). Current releases have removed the dependency on this utility and the examples in this document have been updated correspondingly.

The following information details installation and usage examples for `eslint-plugin-cypress` together with related plugins in an ESLint flat config environment.

## Installation

It is recommended to use a minimum ESLint `8.x` version [eslint@8.57.0](https://github.com/eslint/eslint/releases/tag/v8.57.0) or ESLint `9.x`.

```shell
npm install eslint eslint-plugin-cypress --save-dev
```

or

```shell
yarn add eslint eslint-plugin-cypress --dev
```

## Usage examples

Add a flat configuration file `eslint.config.mjs` to the root directory of your Cypress project and include the following instructions to import the available flat configurations using:

```shell
import pluginCypress from 'eslint-plugin-cypress/flat'
```

There are two specific flat configurations available:

| Configuration         | Content                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configs.globals`     | defines globals `cy`, `Cypress`, `expect`, `assert` and `chai` used in Cypress test specs as well as `globals.browser` and `globals.mocha` from [globals](https://www.npmjs.com/package/globals). Additionally, `languageOptions` of `ecmaVersion: 2019` and `sourceType: 'module'` for backwards compatibility with earlier versions of this plugin are defined. There are no default rules enabled in this configuration. |
| `configs.recommended` | enables [recommended Rules](README.md#rules). It includes also `configs.global` (see above)                                                                                                                                                                                                                                                                                                                                 |

In the following sections, different examples of possible configuration file contents are given, together with some brief explanations. Adapt these examples according to your needs.

### Cypress

All rules from `eslint-plugin-cypress` are available through `eslint-plugin-cypress/flat`.
- [cypress/unsafe-to-chain-command](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/unsafe-to-chain-command.md) is active and set to `error`

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

The `eslint-plugin-cypress` [recommended rules](README.md#rules) `configs.recommended` are activated, except for
- [cypress/no-unnecessary-waiting](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-waiting.md) set to `off`

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

### Cypress and Mocha recommended

[eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) is added to the example [Cypress recommended](#cypress-recommended). This plugin offers a flat file recommended option `configs.flat.recommended`.

The settings for individual `mocha` rules from the `configs.flat.recommended` option are changed.
- [mocha/no-exclusive-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-exclusive-tests.md) and [mocha/no-skipped-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-skipped-tests.md) are set to `error` instead of `warn`
- [mocha/no-mocha-arrows](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-mocha-arrows.md) is set to `off` instead of `error`

```shell
npm install eslint-plugin-mocha@^10.4.3 --save-dev
```

```js
import pluginMocha from 'eslint-plugin-mocha'
import pluginCypress from 'eslint-plugin-cypress/flat'
export default [
  pluginMocha.configs.flat.recommended,
  pluginCypress.configs.recommended,
  {
    rules: {
      'mocha/no-exclusive-tests': 'warn',
      'mocha/no-skipped-tests': 'warn',
      'mocha/no-mocha-arrows': 'off',
      'cypress/no-unnecessary-waiting': 'off'
    }
  }
]
```

### Cypress and Chai recommended

[eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) (minimum version [eslint-plugin-chai-friendly@0.8.0](https://github.com/ihordiachenko/eslint-plugin-chai-friendly/releases/tag/v0.8.0) required for ESLint v9 support and flat config support) is combined with the Cypress plugin `eslint-plugin-cypress`.

The recommended rules for both plugins are used: `pluginCypress.configs.recommended` and `pluginChaiFriendly.configs.recommended`:

```shell
npm install eslint-plugin-chai-friendly@^0.8.0 --save-dev
```

```js
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginChaiFriendly from 'eslint-plugin-chai-friendly'
export default [
  pluginCypress.configs.recommended,
  pluginChaiFriendly.configs.recommended,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  }
]
```
