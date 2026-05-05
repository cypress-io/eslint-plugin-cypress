# cypress/no-cypress-on-in-each-or-test

📝 Disallow `Cypress.on` / `Cypress.once` inside test bodies or each hooks (session-wide listeners and duplicate registration).

<!-- end auto-generated rule header -->

`Cypress.on` and `Cypress.once` register on the global `Cypress` object for the rest of the browser session. They are not scoped to a single test and are not automatically removed between tests like `cy.on` listeners.

Putting them in `beforeEach` or `afterEach` adds duplicate listeners on every run unless you also call `Cypress.off`. Putting them inside `it` / `test` / `specify` is easy to misread as test-scoped behavior.

## Rule Details

Examples of **incorrect** code for this rule:

```js
beforeEach(() => {
  Cypress.on('uncaught:exception', () => false)
})

it('a test', () => {
  Cypress.on('uncaught:exception', () => false)
})
```

Examples of **correct** code for this rule:

```js
// support file or suite-level hook
before(() => {
  Cypress.on('uncaught:exception', () => false)
})

Cypress.on('uncaught:exception', () => false)
```

When you need per-test behavior, prefer [`cy.on`](https://on.cypress.io/catalog/events#App-Events) or ensure you unregister with `Cypress.off` using the same listener reference.
