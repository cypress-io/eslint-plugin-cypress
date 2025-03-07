# Disallow using `cy.xpath()` calls (`cypress/no-xpath`)

<!-- end auto-generated rule header -->

This rule disallows the usage of `cy.xpath()` for selecting elements.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.xpath('//div[@class=\"container\"]').click()
```

Examples of **correct** code for this rule:

```js
cy.get('[data-cy="container"]').click();
```

## Further Reading

Both `@cypress/xpath` and `cypress-xpath` are deprecated.

See [the Cypress Best Practices guide](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements).
