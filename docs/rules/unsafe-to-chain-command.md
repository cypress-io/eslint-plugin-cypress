## Unsafe to chain command

See [retry-ability guide](https://docs.cypress.io/guides/core-concepts/retry-ability#Actions-should-be-at-the-end-of-chains-not-the-middle).

## Configuration

Out of the box, `eslint-plugin-cypress` covers Cypress's native commands, however, custom commands will not trigger a linting error. To get around this, a `methods` array can be supplied to the rule:

```json
"cypress/unsafe-to-chain-command": [
  "error",
  {
    "methods": [
      "realClick",
      "customCmd*"
    ]
  }
]
```

> NOTE: for more in-depth information on how to construct globs for use with this library, check out the [`micromatch`](https://www.npmjs.com/package/micromatch) documentation.
