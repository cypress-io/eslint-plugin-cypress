# Require `data-*` attribute selectors (`cypress/require-data-selectors`)

<!-- end auto-generated rule header -->
Require `cy.get` to use only selectors that target `data-*` attributes.

> Note: If you use this rule, consider only using the `warn` error level, since using `data-*` attribute selectors may not always be possible.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.get(".a")
cy.get('[daedta-cy=submit]').click()
cy.get('[d-cy=submit]')
cy.get(".btn-large").click()
cy.get(".btn-.large").click()
```

Examples of **correct** code for this rule:

```js
cy.get('[data-cy=submit]').click()
cy.get('[data-QA=submit]')
```

## Further Reading

See [the Cypress Best Practices guide](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements).
