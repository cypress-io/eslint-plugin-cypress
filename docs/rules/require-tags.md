# cypress/require-tags

📝 Require tests to declare tags in the options argument.

<!-- end auto-generated rule header -->

Enforces the usage of tags on each test so you can filter tests with [@cypress/grep](https://www.npmjs.com/package/@cypress/grep#filter-with-tags).

## Rule Details

This rule ensures every test or suite call includes a `tags` option (non-empty array) as the second argument, enabling tag-based test filtering. It applies to `it()`, `specify()`, `context()`, and `describe()`, including their `.only` and `.skip` variants.

Examples of **incorrect** code for this rule:

```js
it('test', () => {
  expect(true).to.be.true
})
```

```js
it('test', { tags: [] }, () => {
  expect(true).to.be.true
})
```

```js
it('test', { tags: '' }, () => {
  expect(true).to.be.true
})
```

```js
describe('suite', () => {})
```

Examples of **correct** code for this rule:

```js
it('test', { tags: ['config', 'some-other-tag'] }, () => {
  expect(true).to.be.true
})
```

```js
it('test', { tags: 'config' }, () => {
  expect(false).to.be.false
})
```

```js
describe('suite', { tags: ['smoke'] }, () => {})
```
## Further Reading

- [@cypress/grep - Filter with tags](https://www.npmjs.com/package/@cypress/grep#filter-with-tags)
