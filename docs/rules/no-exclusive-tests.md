# Prevent use of exclusive tests (i.e. .only()) (no-exlusive-tests)

This rule warns you if you leave a `.only()` exclusive test call in your tests.
These are often used for development purposed and are often commited in error.


## Rule Details

This rule aims to prevent accidental commiting of exclusive tests which unintentionally disable large portions of your test suites.

Examples of **incorrect** code for this rule:

```js

it.only();
context.only();
describe.only();

```

Examples of **correct** code for this rule:

```js

it();
context();
describe();

```

## When Not To Use It

* If for some reason you have a need to disable all test baring the exception of one exclusive test or context.
* If you use another library which exposes a similar API as mocha (e.g. describe.only), you should turn this rule off, because it would raise warnings.


## Further Reading

References to other examples of this rule used elsewhere:

* [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-exclusive-tests.md)

[Exclusive Tests](https://mochajs.org/#exclusive-tests)