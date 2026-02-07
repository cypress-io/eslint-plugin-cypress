# require tags (`require-tags`)

Enforces the usage of tags on each test so you can filter tests with [@cypress/grep](https://www.npmjs.com/package/@cypress/grep#filter-with-tags).

## Rule Details

This rule ensures every `it()` and `it.skip()` call includes a `tags` option (non-empty array) as the second argument, enabling tag-based test filtering.

Examples of **incorrect** code for this rule:

```js
it('works as an array', () => {
  expect(true).to.be.true
})
```

Examples of **correct** code for this rule:

```js
it('works as an array', { tags: ['config', 'some-other-tag'] }, () => {
  expect(true).to.be.true
})
```

## When Not To Use It

Turn off this rule if you are not using @cypress/grep or tag-based test filtering.

## Further Reading

- [@cypress/grep - Filter with tags](https://www.npmjs.com/package/@cypress/grep#filter-with-tags)
