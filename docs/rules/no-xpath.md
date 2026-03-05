# cypress/no-xpath

📝 Disallow using `cy.xpath()` calls.

❌ This rule is deprecated. The reason for rule deprecation is the underlying deprecation and removal of support for the `@cypress/xpath` npm module in 2023. The rule is currently provided as a convenience to identify existing code that requires migration to supported API calls and it is planned for removal in a future major release of the plugin.

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

## Migration

Both [@cypress/xpath](https://www.npmjs.com/package/@cypress/xpath) and the earlier [cypress-xpath](https://www.npmjs.com/package/cypress-xpath) npm packages are deprecated and no longer supported.
These packages previously provided the command `cy.xpath()` and they should be uninstalled from the Cypress project after migrating `cy.xpath()` selection to `cy.get()`. See below for more details.

After migrating away from `cy.xpath()`, the rule can be set to `off` or can be permanently removed from the ESLint configuration.

## Further Reading

See [the Cypress Best Practices guide](https://docs.cypress.io/app/core-concepts/best-practices.html#Selecting-Elements).
