# cypress/no-chained-get

📝 Disallow chain of `cy.get()` calls.

<!-- end auto-generated rule header -->

This rule disallows the usage of chained `.get()` calls as `cy.get()` always starts its search from the cy.root element.
A `.get()` is reported anywhere later in a chain that started with `.get()`, even when other commands such as `.find()` or `.should()` come in between.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.get('parent').get('child')
cy.get('parent').find('child').get('other')
cy.get('parent').should('exist').get('other')
```

Examples of **correct** code for this rule:

```js
cy.get('parent').find('child')
```
