# Cypress ESLint Plugin

An ESLint plugin for projects using [Cypress](https://cypress.io) for tests.

Specifies globals for Cypress (`cy` & `Cypress`) as well as browser and mocha globals.

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
