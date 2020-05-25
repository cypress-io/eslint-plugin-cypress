# Prevent using async/await in Cypress test cases (no-async-tests)

Cypress commands are often misinterpreted as regular Promises as they share a similar api (`.then` read more [here](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises)).
Cypress cannot yield asynchronous values back to calling code due to intentional design decisions.
Because of this, modern async/await syntax will behave in unexpected ways and should be avoided. 


## Rule Details

This rule aims to make it obvious when you are potentially making false assumptions around how to handle async Cypress commands.

Examples of **incorrect** code for this rule:

```js

describe("my feature", () => {
    it("my test case", async ()  => {
        await cy.get(".myClass")
        // other operations
    })
})
```

Examples of **correct** code for this rule:

```js

describe("my feature", () => {
    it("my test case", ()  => {
        cy.get(".myClass")
        // other operations
    })
})

```

## When Not To Use It

If there are genuine use-cases for using async await in your test cases then you may not want to include this rule (or at least demote it to a warning).

## Further Reading

- [Commands Are Asynchronous](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Asynchronous)
- [Commands Are Promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises)

