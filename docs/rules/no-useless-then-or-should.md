# Avoid `.should()` and `.then()` when only wrapping commands (no-useless-then-or-should)

.should()` and `.then()` can be removed when they only wrap commands
and their function argument doesn't take any argument.

## Rule Details

This rule simplifies code by removing unneeded calls to `cy.should()`
and `cy.then()`.

Examples of **incorrect** code for this rule:

```js
cy.then(() => cy.contains("foo"))

cy.should(() => {
  cy.get("@stub").should("have.been.called");
  cy.contains("foo");
})
```

Examples of **correct** code for this rule:

```js
cy.contains("foo")

cy.get("@stub").should("have.been.called");
```

## When Not To Use It

When you don't mind having code that is harder to read than necessary.
