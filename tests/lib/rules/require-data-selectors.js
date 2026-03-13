'use strict'

const rule = require('../../../lib/rules/require-data-selectors')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('require-data-selectors', rule, {
  valid: [
    { code: 'cy.get(\'[data-cy=submit]\').click()' },
    { code: 'cy.get(\'[data-QA=submit]\')' },
    { code: 'cy.clock(5000)' },
    { code: 'cy.scrollTo(0, 10)' },
    { code: 'cy.tick(500)' },
    { code: 'cy.get(`[data-cy=${1}]`)' },
    { code: 'cy.get("@my-alias")' },
    { code: 'cy.get(`@my-alias`)' },
    { code: 'const ASSESSMENT_SUBMIT = "[data-cy=assessment-submit]"; cy.get(ASSESSMENT_SUBMIT)' },
    { code: 'const ALIAS_TEMPLATE = `@my-alias`; cy.get(ALIAS_TEMPLATE)' },
    { code: 'const TEMPLATE = `[data-cy=${1}]`; cy.get(TEMPLATE)' },
    { code: 'const ALIAS_TEMPLATE = `@my-alias`; const REASSIGNED = ALIAS_TEMPLATE; cy.get(REASSIGNED)' },
    { code: 'cy.get(condition ? "[data-cy=submit]" : "@my-alias")' },
    { code: 'const ALIAS_TEMPLATE = `@my-alias`; cy.get(condition ? "[data-cy=submit]" : ALIAS_TEMPLATE)' },
    { code: 'const ALIAS_TEMPLATE = condition ? "[data-cy=submit]" : "@my-alias"; cy.get(ALIAS_TEMPLATE)' },
  ],

  invalid: [
    { code: 'cy.get(\'[daedta-cy=submit]\').click()', errors },
    { code: 'cy.get(\'[d-cy=submit]\')', errors },
    { code: 'cy.get(".btn-large").click()', errors },
    { code: 'cy.get(".btn-.large").click()', errors },
    { code: 'cy.get(".a")', errors },
    { code: 'cy.get(`[daedta-cy=${1}]`)', errors },
    { code: 'const BAD_SELECTOR = ".my-class"; cy.get(BAD_SELECTOR)', errors },
    { code: 'const GOOD = "[data-cy=good]"; const BAD = ".bad"; cy.get(GOOD); cy.get(BAD)', errors },
    { code: 'const TEMPLATE = `[daedta-cy=${1}]`; cy.get(TEMPLATE)', errors },
    { code: 'const BAD = ".bad"; const REASSIGNED = BAD; cy.get(REASSIGNED)', errors },
    { code: 'cy.get(condition ? ".bad" : "@my-alias")', errors },
    { code: 'const BAD_SELECTOR = ".my-class"; cy.get(condition ? BAD_SELECTOR : "@my-alias")', errors },
    { code: 'const BAD_SELECTOR = condition ? BAD_SELECTOR : "@my-alias"; cy.get(BAD_SELECTOR)', errors },
  ],
})
