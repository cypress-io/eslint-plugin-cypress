# cypress/no-unnecessary-assertions

📝 Disallow unnecessary assertions on Cypress chainable objects.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Query commands like [`cy.get()`](https://on.cypress.io/get) return a Cypress chainable — an object that queues the command. It is not the element, and it exists whether or not the selector ever matches. A Chai assertion on that object therefore checks the chainable, not the page:

```js
expect(cy.get('.badge')).to.exist
```

The immediate Chai assertion passes because the chainable exists, but this does **not** mean the test always passes. The queued `cy.get()` still retries and can fail if `.badge` does not exist. The Chai assertion adds no check of the yielded subject; use `.should(...)` to attach the intended assertion to the Cypress command chain.

This is an opt-in assertion-clarity rule, not a guarantee of additional defect detection. For a basic DOM existence query, replacing the outer assertion with `.should('exist')` does not establish coverage that the query was missing. This differs from a truthiness assertion on a Playwright Locator, where merely constructing the Locator does not queue a DOM query.

## Relation to Other Rules

[`no-assigning-return-values`](./no-assigning-return-values.md) discourages storing a Cypress command's return value in a variable as though it were the yielded result. This rule addresses a related inline form: `expect(cy.get('.badge')).to.exist` has no variable declaration for that rule to report. The rules address different syntax associated with confusing a command chain with its yielded subject; this rule is not a general check for all such mistakes.

## Rule Details

This rule reports a simple Chai assertion whose subject is an inline Cypress query chain and whose terminal is satisfied by the chainable object:

- `.to.exist`
- `.to.be.ok`
- `.to.not.be.null`
- `.to.not.be.undefined`
- `.to.be.an('object')`

The query chain must start from `cy` with [`get`](https://on.cypress.io/get), [`contains`](https://on.cypress.io/contains), [`focused`](https://on.cypress.io/focused) or [`root`](https://on.cypress.io/root). Commands that need a previous subject, such as `find`, `first` or `children`, are supported after one of those. `expect(cy.find('.badge')).to.exist` is not reported: `cy.find()` throws at runtime, which is a different mistake.

The assertion must be made with Chai's `expect`, reached in one of these ways:

- the global `expect`, or `chai.expect` on the global `chai`
- `import { expect } from 'chai'`
- `const { expect } = require('chai')`
- `chai.expect` where `chai` is a default or namespace import of `'chai'`, or `const chai = require('chai')`

The rule skips locally declared or reassigned `cy`, `expect` and `chai` bindings, imports from unrelated modules, and TypeScript `import chai = require('chai')` declarations. `chai.expect` is recognized only while every use of that `chai` in the file is a method call such as `chai.use(plugin)`. Any other use, such as `chai.expect = custom` or `Object.assign(chai, custom)`, could replace its `expect`, so the rule then reports nothing for it. It also skips computed/optional chains, unknown commands, and compound assertions such as `.to.have.property('name').and.to.exist` or `.to.exist.and.be.ok`: an earlier assertion may fail or change Chai's subject, and chains are not analyzed further. Supported value-yielding continuations (`its`, `invoke`, `then`, `should`, `and`) are reported without an automatic fix.

Examples of **incorrect** code for this rule:

```js
expect(cy.get('.badge')).to.exist
expect(cy.get('.badge')).to.be.ok
expect(cy.get('.badge')).to.not.be.null
chai.expect(cy.get('.badge')).to.exist
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

For a supported DOM-query chain, the fix replaces the standalone assertion with `.should('exist')`. This checks the yielded element rather than the chainable and does not require a hidden element to be visible.

The fix is deliberately narrower than reporting: every command must be a supported query, every `get()` selector must be a non-alias string literal or template literal without expressions, and no surrounding comment may be lost. Alias lookups (`cy.get('@value')`), dynamic selectors, value-yielding continuations, assertions used as values, and TypeScript assertions/non-null/satisfies wrappers around the subject are reported without a fix. A query expression starting with a parenthesized receiver is also left unchanged to avoid introducing an automatic semicolon insertion hazard. An alias or continuation may yield arbitrary data, so choose its `.should(...)` assertion manually. Existence assertions are not restricted to elements; the rule simply does not assume existence is the intended assertion for arbitrary yielded values.

The fix changes only the assertion. When `expect` or `chai` comes from an import or `require` of `'chai'` and the fixed assertions were its only uses, that binding is left unused. Remove it by hand, or let the project's own tooling do so.

## When Not To Use It

Leave this rule disabled if removing redundant chainable assertions is not useful enough for your project's lint policy. The basic existence rewrite is not evidence that a previously undetected application bug will now fail the test.

If you deliberately assert on the chainable object itself — for instance while testing a custom command's return value — disable the rule for that line.

Disable this rule for code that replaces Chai's `expect` or its built-in assertions with custom behavior.

## Further Reading

- [Assertions](https://on.cypress.io/assertions)
- [Introduction to Cypress: Assertions](https://on.cypress.io/introduction-to-cypress#Assertions)
- [`.should()`](https://on.cypress.io/should)
