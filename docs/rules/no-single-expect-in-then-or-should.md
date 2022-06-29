# Simplify tests by avoiding lonely expect()

Disallow usage of expect() statements when they are alone in a
`then()` or `should()`.

Some problems reported by this rule are automatically fixable by the
`--fix` command line option.

## Rule Details

This rule makes code easier to read when both conditions are met:
1. a `then()` (or `should()`) contains a single call to `expect()` and
2. the `then()` (or `should()`) has the same argument as `expect()`.

Example of **incorrect** code for this rule:

```js
cy.wait("@PutCountry")
  .its("request.body.userIds")
  .then((userIds) => {
    expect(userIds).to.have.members(expectedUserIds);
  });
```

Example of **correct** code for this rule:

```js
cy.wait("@PutCountry")
  .its("request.body.userIds")
  .should("have.members", expectedUserIds);
```

## When Not To Use It

When you don't mind having code that is harder to read than necessary.
