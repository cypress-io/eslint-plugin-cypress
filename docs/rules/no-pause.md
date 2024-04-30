# Disallow using `cy.pause()` calls (`cypress/no-pause`)

<!-- end auto-generated rule header -->
It is recommended to remove any [cy.pause](https://on.cypress.io/pause) commands before committing specs to avoid other developers getting unexpected results.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.pause();
```

Examples of **correct** code for this rule:

```js
// only the parent cy.pause command is detected
cy.get('selector').pause();
```
