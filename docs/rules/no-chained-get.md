# cypress/no-chained-get

📝 Disallow chain of `cy.get()` calls.

<!-- end auto-generated rule header -->

This rule disallows the usage of chained `.get()` calls as `cy.get()` always starts its search from the cy.root element.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.get('parent').get('child')
```

Examples of **correct** code for this rule:

```js
cy.get('parent').find('child')
```
