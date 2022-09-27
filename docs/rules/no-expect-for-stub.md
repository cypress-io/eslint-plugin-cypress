# Avoid expect(stub)… (no-expect-for-stub)

Disallow usage of `expect()` with a [Sinon-Chai
chainer](https://docs.cypress.io/guides/references/assertions#Sinon-Chai)
(e.g., `expect(stub).to.have.been.calledOnce`) preferring the usage of
`should()`.

Some problems reported by this rule are automatically fixable by the
`--fix` command line option. Please be aware that fixing the code with
this rule requires that the stub is aliased (using the [`.as()`
Cypress command](https://docs.cypress.io/api/commands/as)): if that's
not the case, you will have to add an alias manually for the test to
pass.

## Rule Details

This rule makes code easier to read when `expect()` is used on a stub
with [Sinon-Chai chainer
chainer](https://docs.cypress.io/guides/references/assertions#Sinon-Chai).

Example of **incorrect** code for this rule:

```js
let onBudgetChanged = cy.stub().as("onBudgetChanged");
// … do something with onBudgetChanged…

cy.get("foo").click();

cy.then(() => {
	expect(onBudgetChanged).to.be.called;
});
```

Note that the `expect()` call is wrapped in a `cy.then()`. This is
mandatory if the `expect()` is to be called after the Cypress commands
above it which is usually the case.

Example of **correct** code for this rule:

```js
// do something with cy.stub().as("onBudgetChanged")
cy.get("foo").click();
cy.get("@onBudgetChanged").should("be.called");
```

## When Not To Use It

- When you don't mind having code that is harder to read than necessary.
- When you don't want to add aliases to the stubs/spies.
