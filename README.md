# Cypress ESLint Plugin

An ESLint plugin for your [Cypress](https://cypress.io) tests.

Specifies globals for Cypress `cy`, `Cypress`, browser and mocha globals.

## Installation

```sh
npm install eslint-plugin-cypress --save-dev
```

## Usage

Add an `.eslintrc.json` file to your `cypress` directory with the following:

```json
// my-project/cypress/.eslintrc.json

{
  "plugins": [
    "cypress"
  ],
  "env": {
    "cypress/globals": true
  }
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
