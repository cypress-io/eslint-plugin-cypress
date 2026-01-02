# cypress/no-async-before

📝 Disallow using `async`/`await` in Cypress `before` methods.

<!-- end auto-generated rule header -->

Cypress commands that return a promise may cause side effects in `before`/`beforeEach` hooks, possibly causing unexpected behavior.

## Rule Details

This rule disallows using `async` `before` and `beforeEach` functions.

Examples of **incorrect** code for this rule:

```js
describe('my feature', () => {
  before('my test case', async () => {
    await cy.get('.myClass')
    // other operations
  })
})
```

```js
describe('my feature', () => {
  before('my test case', async () => {
    cy.get('.myClass').click()

    await someAsyncFunction()
  })
})
```

Examples of **correct** code for this rule:

```js
describe('my feature', () => {
  before('my test case', () => {
    cy.get('.myClass')
    // other operations
  })
})
```

## When Not To Use It

If there are genuine use-cases for using `async/await` in your `before` hooks then you may not want to include this rule (or at least demote it to a warning).

## Further Reading

- [Mixing Async and Sync code](https://on.cypress.io/app/core-concepts/introduction-to-cypress#Mixing-Async-and-Sync-code)
- [Commands Are Asynchronous](https://on.cypress.io/app/core-concepts/introduction-to-cypress.html#Commands-Are-Asynchronous)
