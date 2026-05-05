# cypress/no-cy-in-cypress-listener

📝 Disallow Cypress commands inside `Cypress.on` / `Cypress.once` listeners.

<!-- end auto-generated rule header -->

Cypress commands are queued for the command chain and do not run inside `Cypress.on` or `Cypress.once` callbacks. Logic in those listeners must be synchronous. See [cypress#6316](https://github.com/cypress-io/cypress/issues/6316).

## Rule Details

Examples of **incorrect** code for this rule:

```js
Cypress.on('uncaught:exception', () => {
  cy.get('#x')
})
```

Examples of **correct** code for this rule:

```js
Cypress.on('uncaught:exception', () => false)

it('uses cy in the test', () => {
  cy.get('#x')
})
```

This rule does not apply to `cy.on` listeners, which follow different lifecycle rules.
