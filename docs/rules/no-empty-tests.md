# Checks if tests are empty (no-empty-tests)

Empty tests will always pass.
In large testsuites tests might have been initialized but not yet written.
Passing but nevertheless empty tests will suggest functionality has been tested, although it hasn't.
Having empty tests might seem convenient for reasons, it isn't on execution though.
Empty tests should always be deleted or skipped.

## Rule Details

This rule aims to prevent the execution of empty tests.

Examples of **incorrect** code for this rule:

```js
it('an empty test', () => {} )
describe('nested', () => { it('empty test', () => { } ) })
context('nested', () => { it('empty test', () => { } ) })
test('an empty test', () => {} )
describe('nested', () => { test('empty test', () => { } ) })
context('nested', () => { test('empty test', () => { } ) })
```

Examples of **correct** code for this rule:

```js
 foo.bar('random empty function', () => {})
 it.skip('a skipped empty test', () => {} )
 it('do something', () => { cy.dataCy('getter') } )
 describe.skip('nested skip', () => { it('empty test', () => { } ) })
 context.skip('nested skip', () => { it('empty test', () => { } ) })
 describe.skip('nested skip', () => { context('nested', () => { it('empty test', () => { } ) }) })
 test.skip('a skipped empty test', () => {} )
 test('do something', () => { cy.dataCy('getter') } )
 describe.skip('nested skip', () => { test('empty test', () => { } ) })
 context.skip('nested skip', () => { test('empty test', () => { } ) })
 describe.skip('nested skip', () => { context('nested', () => { test('empty test', () => { } ) }) })
```