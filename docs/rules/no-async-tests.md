# cypress/no-async-tests

📝 Disallow using `async`/`await` in Cypress test cases.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Cypress commands are queued and run asynchronously after the test function returns.
An `async` test function returns a promise, so Cypress considers the test finished as soon as that promise resolves, without waiting for the queued `cy` commands.
Depending on the test code, this has one of the following effects:

- the test passes even though a later `cy` command or assertion fails (see [cypress-io/cypress#4742](https://github.com/cypress-io/cypress/issues/4742)), so real failures go unnoticed
- Cypress [errors because the test returned a promise while also invoking `cy` commands](https://docs.cypress.io/app/references/error-messages.html#Cypress-detected-that-you-returned-a-promise-from-a-command-while-also-invoking-one-or-more-cy-commands-in-that-promise)

Avoid `async` test functions to keep test results reliable.

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
