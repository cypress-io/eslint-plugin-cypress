# Cypress ESLint Plugin

An ESLint plugin for projects that use Cypress.

Specifies the environment and globals (`cy`, `Cypress`, etc) for use when writing tests using [Cypress](https://cypress.io).

## Installation

```sh
npm install eslint-plugin-cypress --save-dev
```

## Usage

Add `cypress` as a plugin in your `.eslintrc`:

```json
{
  "plugins": [
    "cypress"
  ]
}
```
