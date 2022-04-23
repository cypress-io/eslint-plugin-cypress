'use strict'

const rule = require('../../../lib/rules/no-empty-tests')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('no-empty-tests', rule, {
  valid: [
    { code: 'foo.bar(\'random empty function\', () => {})', parserOptions },
    { code: 'it.skip(\'a skipped empty test\', () => {} )', parserOptions },
    { code: 'it(\'do something\', () => { cy.dataCy(\'getter\') } )', parserOptions },
    { code: 'describe.skip(\'nested skip\', () => { it(\'empty test\', () => { } ) })', parserOptions },
    { code: 'context.skip(\'nested skip\', () => { it(\'empty test\', () => { } ) })', parserOptions },
    { code: 'describe.skip(\'nested skip\', () => { context(\'nested\', () => { it(\'empty test\', () => { } ) }) })', parserOptions },
    { code: 'test.skip(\'a skipped empty test\', () => {} )', parserOptions },
    { code: 'test(\'do something\', () => { cy.dataCy(\'getter\') } )', parserOptions },
    { code: 'describe.skip(\'nested skip\', () => { test(\'empty test\', () => { } ) })', parserOptions },
    { code: 'context.skip(\'nested skip\', () => { test(\'empty test\', () => { } ) })', parserOptions },
    { code: 'describe.skip(\'nested skip\', () => { context(\'nested\', () => { test(\'empty test\', () => { } ) }) })', parserOptions },
  ],

  invalid: [
    { code: 'it(\'an empty test\', () => {} )', parserOptions, errors },
    { code: 'describe(\'nested\', () => { it(\'empty test\', () => { } ) })', parserOptions, errors },
    { code: 'context(\'nested\', () => { it(\'empty test\', () => { } ) })', parserOptions, errors },
    { code: 'test(\'an empty test\', () => {} )', parserOptions, errors },
    { code: 'describe(\'nested\', () => { test(\'empty test\', () => { } ) })', parserOptions, errors },
    { code: 'context(\'nested\', () => { test(\'empty test\', () => { } ) })', parserOptions, errors },
  ],
})
