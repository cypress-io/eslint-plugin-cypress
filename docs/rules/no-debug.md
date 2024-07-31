# Disallow using `cy.debug()` calls (`cypress/no-debug`)

<!-- end auto-generated rule header -->
It is recommended to remove any [cy.debug](https://on.cypress.io/debug) commands before committing specs to avoid other developers getting unexpected results.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.debug();
cy.get('selector').debug();
```

Examples of **correct** code for this rule:

```js
cy.get('selector')
```
