# Cypress ESLint Config

An ESLint config for projects that use Cypress.

Specifies the environment and globals (`cy`, `Cypress`, etc) for use when writing tests using [Cypress](https://cypress.io).

## Installation

```sh
npm install eslint-config-cypress --save-dev
```

## Usage

Add `cypress` as a config in your `.eslintrc`:

```json
{
  "extends": [
    "cypress"
  ]
}
```
