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
    { code: 'cy.get(\`[data-cy=${1}]\`)' }, // eslint-disable-line no-useless-escape
    { code: 'cy.get("@my-alias")' },
    { code: 'cy.get(`@my-alias`)' },
  ],

  invalid: [
    { code: 'cy.get(\'[daedta-cy=submit]\').click()', errors },
    { code: 'cy.get(\'[d-cy=submit]\')', errors },
    { code: 'cy.get(".btn-large").click()', errors },
    { code: 'cy.get(".btn-.large").click()', errors },
    { code: 'cy.get(".a")', errors },
    { code: 'cy.get(\`[daedta-cy=${1}]\`)', errors }, // eslint-disable-line no-useless-escape
  ],
})
