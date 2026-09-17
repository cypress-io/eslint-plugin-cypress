# cypress/no-unnecessary-assertions

📝 Disallow assertions on a Cypress chainable that can never fail.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Query commands like [`cy.get()`](https://on.cypress.io/get) return a Cypress chainable — an object that queues the command. It is not the element, and it exists whether or not the selector ever matches. A chai assertion on that object therefore checks the chainable, not the page:

```js
expect(cy.get('.badge')).to.exist
```

This passes on a blank page. It passes when `.badge` was renamed three refactors ago. It cannot fail, so the test reports coverage it does not have.

Because the assertion never fails, this is harder to notice than a broken selector: a rotted positive assertion goes red on the next run and gets fixed, while this one stays green forever.

## Rule Details

This rule reports a chai assertion whose subject is an inline `cy.*` query chain and whose terminal is satisfied by any object:

- `.to.exist`
- `.to.be.ok`
- `.to.not.be.null`
- `.to.not.be.undefined`
- `.to.be.an('object')`

Examples of **incorrect** code for this rule:

```js
expect(cy.get('.badge')).to.exist
expect(cy.get('.badge')).to.be.ok
expect(cy.get('.badge')).to.not.be.null
expect(cy.contains('Save')).to.exist
expect(cy.get('.list').find('.row').first()).to.exist
```

Examples of **correct** code for this rule:

```js
// Assert through the command chain: it retries and resolves the element.
cy.get('.badge').should('exist')
cy.get('.badge').should('be.visible')
cy.get('.badge').should('not.exist')

// Inside .then(), the subject is the yielded element, not the chainable.
cy.get('.badge').then(($el) => {
  expect($el).to.exist
})

// Assertions that can genuinely fail on a chainable are left alone.
expect(cy.get('.badge')).to.have.property('should')
expect(cy.get('.badge')).to.be.an('array')

// Non-Cypress subjects are never reported.
expect(count).to.exist
```

## Autofix

The fix rewrites the assertion to `.should('exist')` — the same claim the original made, so a
hidden-but-present element does not start failing after `--fix`. It is applied only when the
chain's last command is a query and the assertion is a standalone statement. Chains ending in a
value-yielding command (`.its()`, `.invoke()`) are reported but left alone, since an element
assertion on a string or number would fail at runtime.

## When Not To Use It

If you deliberately assert on the chainable object itself — for instance while testing a custom command's return value — disable the rule for that line.

## Further Reading

- [Assertions](https://on.cypress.io/assertions)
- [Introduction to Cypress: Assertions](https://on.cypress.io/introduction-to-cypress#Assertions)
- [`.should()`](https://on.cypress.io/should)
