# Require screenshots to be preceded by an assertion (`cypress/assertion-before-screenshot`)

<!-- end auto-generated rule header -->
If you take screenshots without assertions then you may get different screenshots depending on timing.

For example, if clicking a button makes some network calls and upon success, renders something, then the screenshot may sometimes have the new render and sometimes not.

## Rule Details

This rule checks there is an assertion making sure your application state is correct before doing a screenshot. This makes sure the result of the screenshot will be consistent.

Examples of **incorrect** code for this rule:

```js
cy.visit('myUrl');
cy.screenshot();
```

Examples of **correct** code for this rule:

```js
cy.visit('myUrl');
cy.get('[data-test-id="my-element"]').should('be.visible');
cy.screenshot();
```
