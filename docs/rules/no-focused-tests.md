# Disallow focused tests (no-focused-tests)

Inspired by the [`no-focused-tests` rule in `eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest/blob/19e3a6e7b71a25881b7b75531f2d8aad32d9d589/docs/rules/no-focused-tests.md), this rule reminds you to remove `.only` from your Cypress tests.

## Rule Details

This rule detects occurrences of `describe.only` and `it.only` in the source code.

Examples of **incorrect** code for this rule:

```js
describe.only(('my describe block'), () => {
    it('works', () => {});
});
describe(('my describe block'), () => {
    it.only('works', () => {});
});
```

Examples of **correct** code for this rule:

```js
describe(('my describe block'), () => {
    it('works', () => {});
});
```

## When Not To Use It

If you want to run only one test case and/or describe block, you may not want to use this rule.
