'use strict'

const rule = require('../../../lib/rules/no-unnecessary-assertions')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-unnecessary-assertions', rule, {

  valid: [
    // The idiomatic form: assert through the command chain, which retries and
    // resolves the element.
    { code: 'cy.get(\'.badge\').should(\'exist\')' },
    { code: 'cy.get(\'.badge\').should(\'be.visible\')' },
    { code: 'cy.get(\'.badge\').should(\'not.exist\')' },
    { code: 'cy.contains(\'Save\').should(\'be.enabled\')' },

    // `expect()` on a yielded value is fine — the subject is the resolved element,
    // not the chainable.
    { code: 'cy.get(\'.badge\').then(($el) => { expect($el).to.exist })' },
    { code: 'cy.get(\'.badge\').its(\'length\').then((n) => { expect(n).to.eq(3) })' },

    // Assertions that can genuinely fail on a chainable are left alone.
    { code: 'expect(cy.get(\'.badge\')).to.have.property(\'should\')' },
    { code: 'expect(cy.get(\'.badge\')).to.be.an(\'array\')' },
    { code: 'expect(cy.get(\'.badge\')).to.not.be.ok' },
    { code: 'expect(cy.get(\'.badge\')).to.equal(other)' },

    // Non-Cypress subjects: an identifier could hold anything, and these are the
    // ordinary chai assertions the rule must not touch.
    { code: 'expect(count).to.exist' },
    { code: 'expect(result).to.not.be.null' },
    { code: 'expect(wrapper).to.be.an(\'object\')' },
    { code: 'expect(Cypress.env(\'user\')).to.exist' },

    // `cy` commands that are not queries do not yield elements.
    { code: 'expect(cy.state).to.exist' },

    // Arity guard: chai's two-argument form carries a custom message and is not
    // the shape this rule reasons about.
    { code: 'expect(cy.get(\'.badge\'), \'badge\').to.exist' },

    // Scope: the rule targets element queries. Other cy commands also yield a
    // chainable, but reporting them belongs to a separate, broader rule.
    { code: 'expect(cy.url()).to.exist' },
    { code: 'expect(cy.window()).to.exist' },
  ],

  invalid: [
    {
      code: 'expect(cy.get(\'.badge\')).to.exist',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\')).to.be.ok',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\')).to.not.be.null',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\')).to.not.be.undefined',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\')).to.be.an(\'object\')',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    // Longer query chains resolve to the same chainable.
    {
      code: 'expect(cy.get(\'.list\').find(\'.row\').first()).to.exist',
      output: 'cy.get(\'.list\').find(\'.row\').first().should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.contains(\'Save\')).to.exist',
      output: 'cy.contains(\'Save\').should(\'exist\')',
      errors,
    },
    // Reported but NOT auto-fixed: the chain ends in a value-yielding command, so
    // appending an element assertion would produce code that fails at runtime.
    {
      code: 'expect(cy.get(\'.list\').its(\'length\')).to.exist',
      output: null,
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\').invoke(\'text\')).to.exist',
      output: null,
      errors,
    },
    // Reported but NOT auto-fixed: rewriting a value-position assertion would
    // change what the surrounding expression evaluates to.
    {
      code: 'const ok = expect(cy.get(\'.badge\')).to.exist',
      output: null,
      errors,
    },
    // Reported but NOT auto-fixed: the fix would drop the comment.
    {
      code: 'expect(cy.get(\'.badge\')) /* keep */ .to.exist',
      output: null,
      errors,
    },
  ],
})
