# cypress/no-async-tests

📝 Disallow using `async`/`await` in Cypress test cases.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Cypress tests [that return a promise will error](https://docs.cypress.io/app/references/error-messages.html#Cypress-detected-that-you-returned-a-promise-from-a-command-while-also-invoking-one-or-more-cy-commands-in-that-promise) and cannot run successfully.
An `async` function returns a promise under the hood, so a test using an `async` function will also error.

## Rule Details

This rule disallows using `async` test functions.

Examples of **incorrect** code for this rule:

```js
describe('my feature', () => {
  it('my test case', async () => {
    await cy.get('.myClass')
    // other operations
  })
})
```

```js
describe('my feature', () => {
  it('my test case', async () => {
    cy.get('.myClass').click()

    await someAsyncFunction()
  })
})
```

Examples of **correct** code for this rule:

```js
describe('my feature', () => {
  it('my test case', () => {
    cy.get('.myClass')
    // other operations
  })
})
```

## When Not To Use It

If there are genuine use-cases for using `async/await` in your test cases then you may not want to include this rule (or at least demote it to a warning).

## Further Reading

- [Mixing Async and Sync code](https://on.cypress.io/app/core-concepts/introduction-to-cypress#Mixing-Async-and-Sync-code)
- [Commands Are Asynchronous](https://on.cypress.io/app/core-concepts/introduction-to-cypress.html#Commands-Are-Asynchronous)
