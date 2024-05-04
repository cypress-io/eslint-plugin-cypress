# Cypress ESLint Plugin - Flat Config

This document supplements the [README](README.md) document and describes how to use the Cypress ESLint Plugin (`eslint-plugin-cypress`) in an ESLint flat config environment.

Usage with ESLint `8.57.0` and ESLint `9.x` is described.

## Introduction

[ESLint v9.0.0](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) was released on April 5, 2024, establishing flat config as the default for this version.

Previously, ESLint had announced in their blog post [Flat config rollout plans](https://eslint.org/blog/2023/10/flat-config-rollout-plans/) in October 2023 that flat config was planned to be the default in ESLint `v9.0.0` and that the eslintrc configuration system is planned to be removed in the future ESLint `v10.0.0`.

The Cypress ESLint Plugin (`eslint-plugin-cypress`) is currently based on ESLint `8.x` and has not yet been migrated to support Flat Config natively. [ESLint's new config system, Part 2: Introduction to flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/) from August 2022 introduced the [Backwards compatibility utility](https://eslint.org/blog/2022/08/new-config-system-part-2/#backwards-compatibility-utility). This gives the capability to use `eslint-plugin-cypress` in an ESLint flat config environment.

The following information details installation and usage examples for `eslint-plugin-cypress` together with related plugins in an ESLint flat config environment.

## Installation

It is recommended to use a minimum ESLint `8.x` version [eslint@8.57.0](https://github.com/eslint/eslint/releases/tag/v8.57.0) or ESLint `9.x`.

```shell
npm install eslint @eslint/eslintrc eslint-plugin-cypress@^3.1.1 --save-dev
```

or

```shell
yarn add eslint @eslint/eslintrc eslint-plugin-cypress@^3.1.1 --dev
```

## Usage examples

Add a flat configuration file `eslint.config.mjs` file to the root directory of your Cypress project. In the following sections, different examples of possible configuration file contents are given, together with some brief explanations. Adapt these examples according to your needs.

### Cypress

All rules from `eslint-plugin-cypress` are available through the `FlatCompat` class of [@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc).
- [cypress/unsafe-to-chain-command](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/unsafe-to-chain-command.md) is active and set to `error`

```js
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()
export default [
  ...compat.config(
    {
      plugins: ['cypress'],
      rules: {
        'cypress/unsafe-to-chain-command': 'error'
      }
    })
]
```

### Cypress recommended

The `eslint-plugin-cypress` [recommended rules](README.md#rules) `plugin:cypress/recommended` are activated, except for
- [cypress/no-unnecessary-waiting](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-waiting.md) set to `off`

```js
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()
export default [
  ...compat.config(
    {
      extends: ['plugin:cypress/recommended'],
      rules: {
        'cypress/no-unnecessary-waiting': 'off'
      }
    })
]
```

### Cypress and Mocha recommended

[eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) is added to the previous example. This plugin offers a flat file recommended option `configs.flat.recommended`.

The settings for individual `mocha` rules from the `configs.flat.recommended` option are changed.
- [mocha/no-exclusive-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-exclusive-tests.md) and [mocha/no-skipped-tests](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-skipped-tests.md) are set to `error` instead of `warn`
- [mocha/no-mocha-arrows](https://github.com/lo1tuma/eslint-plugin-mocha/blob/main/docs/rules/no-mocha-arrows.md) is set to `off` instead of `error`

```shell
npm install eslint-plugin-mocha@^10.4.3 --save-dev
```

```js
import { FlatCompat } from '@eslint/eslintrc'
import mochaPlugin from 'eslint-plugin-mocha'
const compat = new FlatCompat()
export default [
  mochaPlugin.configs.flat.recommended, {
    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-skipped-tests': 'error',
      'mocha/no-mocha-arrows': 'off'
    }
  },
  ...compat.config(
    {
      extends: ['plugin:cypress/recommended'],
      rules: {
        'cypress/no-unnecessary-waiting': 'off'
      }
    })
]
```

### Cypress and Chai recommended

[eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) is combined with the Cypress plugin `eslint-plugin-cypress`.

The [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) plugin does not currently offer flat config options and so the `FlatCompat` class of [@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc) enables this plugin to be used too. The recommended rules for both plugins are used: `plugin:cypress/recommended` and `plugin:chai-friendly/recommended`.

```shell
npm install eslint-plugin-chai-friendly --save-dev
```

```js
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()
export default [
  ...compat.config(
    {
      extends: [
        'plugin:cypress/recommended',
        'plugin:chai-friendly/recommended'
      ],
      rules: {
        'cypress/no-unnecessary-waiting': 'off',
      }
    })
]
```

**Pending the resolution of issue https://github.com/ihordiachenko/eslint-plugin-chai-friendly/issues/32 [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) cannot be used with ESLint `v9`.**
