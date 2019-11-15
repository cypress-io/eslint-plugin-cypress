## Disallow arrow functions for hooks

Only allow _normal_ functions instead of arrow functions on the following hooks, in order to keep `this` accessible:
- `describe`
- `context`
- `it`
- `it.skip`
- `it.only`
- `specify`
- `specify.skip`
- `specify.only`
- `before`
- `beforeEach`
- `after`
- `afterEach`

### Rule Details

examples of **incorrect** code with `require-data-selectors`:
```js
describe("foo", () => {})
it("foo", () => {})
it.only("foo", () => {})
before(() => {})
```

examples of **correct** code with `require-data-selectors`:
```js
describe("foo", function() {})
it("foo", function() {})
it.only("foo", function() {})
before(function() {})
```
