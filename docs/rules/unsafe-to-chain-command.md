## Unsafe to chain command

See [retry-ability guide](https://docs.cypress.io/guides/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle).

## Configuration

### `methods`

In cases of custom Cypress commands, a `methods` option can be supplied:

```json
"cypress/unsafe-to-chain-command": [
  "error",
  {
    "methods": [
      "realClick",
      /customHover/
    ]
  }
]
```
