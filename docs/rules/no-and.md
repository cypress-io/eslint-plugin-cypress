# cypress/no-and

📝 Disallow the use of `.and()`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Cypress's [.and()](https://on.cypress.io/and) is an alias for [.should()](https://on.cypress.io/should). Using `.should()` consistently makes assertions easier to read and avoids ambiguity.

## Rule Details

This rule disallows the use of `.and()` in Cypress chains and auto-fixes it to `.should()`.

Examples of **incorrect** code for this rule:

```js
cy.get('foo').and('be.visible')
cy.get('foo').should('be.visible').and('have.text', 'bar')
cy.contains('Submit').and('be.disabled')
cy.get('input').invoke('val').and('eq', 'hello')
```

Examples of **correct** code for this rule:

```js
cy.get('foo').should('be.visible')
cy.get('foo').should('be.visible').should('have.text', 'bar')
cy.contains('Submit').should('be.disabled')
cy.get('input').invoke('val').should('eq', 'hello')
```

## When Not To Use It

If you prefer using `.and()` for readability in chained assertions, turn this rule off.
