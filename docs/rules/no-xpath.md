# cypress/no-xpath

📝 Disallow using `cy.xpath()` calls.

<!-- end auto-generated rule header -->

This rule disallows the usage of `cy.xpath()` for selecting elements.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.xpath('//div[@class=\"container\"]').click()
```

Examples of **correct** code for this rule:

```js
cy.get('[data-cy="container"]').click()
```

## Deprecation and Support

Both [@cypress/xpath](https://www.npmjs.com/package/@cypress/xpath) and the earlier [cypress-xpath](https://www.npmjs.com/package/cypress-xpath) npm packages are deprecated and no longer supported.
These packages previously provided the command `cy.xpath()` and they should be uninstalled from the Cypress project after migrating `cy.xpath()` selection to `cy.get()`. See below for more details.

## Further Reading

See [the Cypress Best Practices guide](https://docs.cypress.io/app/core-concepts/best-practices.html#Selecting-Elements).
