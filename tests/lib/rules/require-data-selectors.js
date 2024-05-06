'use strict'

const rule = require('../../../lib/rules/require-data-selectors')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 6 }

ruleTester.run('require-data-selectors', rule, {
  valid: [
    { code: 'cy.get(\'[data-cy=submit]\').click()', languageOptions },
    { code: 'cy.get(\'[data-QA=submit]\')', languageOptions },
    { code: 'cy.clock(5000)', languageOptions },
    { code: 'cy.scrollTo(0, 10)', languageOptions },
    { code: 'cy.tick(500)', languageOptions },
    { code: 'cy.get(\`[data-cy=${1}]\`)', languageOptions }, // eslint-disable-line no-useless-escape
    { code: 'cy.get("@my-alias")', languageOptions, errors },
    { code: 'cy.get(`@my-alias`)', languageOptions, errors },
  ],

  invalid: [
    { code: 'cy.get(\'[daedta-cy=submit]\').click()', languageOptions, errors },
    { code: 'cy.get(\'[d-cy=submit]\')', languageOptions, errors },
    { code: 'cy.get(".btn-large").click()', languageOptions, errors },
    { code: 'cy.get(".btn-.large").click()', languageOptions, errors },
    { code: 'cy.get(".a")', languageOptions, errors },
    { code: 'cy.get(\`[daedta-cy=${1}]\`)', languageOptions, errors }, // eslint-disable-line no-useless-escape
  ],
})
