# Disallow chain of `cy.get()` calls (`cypress/no-chained-get`)

<!-- end auto-generated rule header -->
This rule disallows the usage of chained `.get()` calls as `cy.get()` always starts its search from the cy.root element.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.get('parent').get('child')
```

Examples of **correct** code for this rule:

```js
cy.get('parent')
  .find('child')
```

```js
cy.get('#comparison')
  .get('div')
  // finds the div.test-title outside the #comparison
  // and the div.feature inside
  .should('have.class', 'test-title')
  .and('have.class', 'feature')
```

## Further Reading

[cy.get()](https://on.cypress.io/api/get) 