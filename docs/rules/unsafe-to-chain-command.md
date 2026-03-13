# cypress/unsafe-to-chain-command

📝 Disallow actions within chains.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

### Options

<!-- begin auto-generated rule options list -->

| Name      | Description                                                 | Type  | Default |
| :-------- | :---------------------------------------------------------- | :---- | :------ |
| `methods` | An additional list of methods to check for unsafe chaining. | Array | `[]`    |

<!-- end auto-generated rule options list -->

## Typed Linting

If [Typed Linting](../../README.md#typed-linting) is enabled, this rule also catches unsafe chaining even when the Cypress chain was started from a helper function.

```js
function getTodo() {
  return cy.get('.todo')
}

getTodo().type('todo A{enter}').type('todo B{enter}')
```

## Further Reading

See [retry-ability guide](https://docs.cypress.io/app/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle).
