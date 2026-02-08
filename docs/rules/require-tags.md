# cypress/require-tags

📝 Require tests to declare tags in the options argument.

<!-- end auto-generated rule header -->

Enforces the usage of tags on each test so you can filter tests with [@cypress/grep](https://www.npmjs.com/package/@cypress/grep#filter-with-tags).

## Rule Details

This rule ensures every `it()` call includes a `tags` option (non-empty array) as the second argument, enabling tag-based test filtering. It also applies to its alias `specify()` and for `.skip` as well as `.only`.

Examples of **incorrect** code for this rule:

```js
it('test', () => {
  expect(true).to.be.true
})
```

```js
it('test', { tags: []} , () => {
  expect(true).to.be.true
})
```



Examples of **correct** code for this rule:

```js
it('test', { tags: ['config', 'some-other-tag'] }, () => {
  expect(true).to.be.true
})
```

## Further Reading

- [@cypress/grep - Filter with tags](https://www.npmjs.com/package/@cypress/grep#filter-with-tags)
