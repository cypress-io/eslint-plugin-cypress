# cypress/no-and

📝 Enforce `.should()` over `.and()` for starting assertion chains.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Cypress's [.and()](https://on.cypress.io/and) is an alias for [.should()](https://on.cypress.io/should). Using `.and()` reads naturally when it follows `.should()` or `.contains()` — it continues an assertion chain like "should be empty **and** be hidden." In other positions, `.should()` is clearer.

## Rule Details

This rule allows `.and()` only when it immediately follows `.should()`, `.and()`, or `.contains()`. In all other positions, it flags `.and()` and auto-fixes it to `.should()`.

Examples of **incorrect** code for this rule:

```js
cy.get('elem').and('have.text', 'blah')
cy.get('foo').find('.bar').and('have.class', 'active')
cy.get('foo').click().and('be.disabled')
```

Examples of **correct** code for this rule:

```js
cy.get('elem').should('have.text', 'blah')
cy.get('.err').should('be.empty').and('be.hidden')
cy.contains('Login').and('be.visible')
cy.get('foo').should('be.visible').and('have.text', 'bar').and('have.class', 'active')
```

## When Not To Use It

If you prefer using `.and()` interchangeably with `.should()` in all positions, turn this rule off.
