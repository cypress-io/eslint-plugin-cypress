# Cypress ESLint Plugin

An ESLint plugin for your [Cypress](https://cypress.io) tests.

Specifies globals for Cypress `cy`, `Cypress`, browser and mocha globals.

## Installation

```sh
npm install eslint-plugin-cypress --save-dev
```

## Usage

Add an `.eslintrc` file to your `cypress` directory with the following:

```json
// my-project/cypress/.eslintrc

{
  "plugins": [
    "cypress"
  ],
  "env": {
    "cypress/globals": true
  }
}
```
