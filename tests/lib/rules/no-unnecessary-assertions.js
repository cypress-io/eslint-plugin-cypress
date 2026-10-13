'use strict'

const rule = require('../../../lib/rules/no-unnecessary-assertions')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

ruleTester.run('no-unnecessary-assertions', rule, {

  valid: [
    // A terminal existence check does not erase earlier assertions or changes
    // to Chai's subject. Computed/optional chains are deliberately unsupported.
    ...[
      'expect(cy.get(\'.badge\')).to.have.property(\'missing\').and.to.exist',
      'expect(cy.get(\'.badge\')).to.equal(other).and.to.exist',
      'expect(cy.get(\'.badge\')).to.have.lengthOf(0).and.to.be.ok',
      'expect(cy.get(\'.badge\')).to.have.property(\'missing\').that.is.an(\'object\')',
      'expect(cy.get(\'.badge\')).to[\'not\'].exist',
      'expect(cy.get(\'.badge\')).to.not.not.be.null',
      'expect(cy.get(\'.badge\')).to.be.an(\'notobject\')',
      'expect(cy.get(\'.badge\')).to.be.an(\'object\', sideEffect())',
      'expect(cy.get(\'.badge\')).to.exist()',
      'expect(cy.get(\'.badge\')).to.be.a',
      'expect(cy?.get(\'.badge\')).to.exist',
      'expect(cy[\'get\'](\'.badge\')).to.exist',
      'expect(cy.get(\'.badge\').custom()).to.exist',
      'expect(cy.get(\'.badge\').subject.get()).to.exist',
      'function check(cy) { expect(cy.get(\'.badge\')).to.exist }',
      'function check(expect) { expect(cy.get(\'.badge\')).to.exist }',
      'const cy = client; expect(cy.get(\'.badge\')).to.exist',
      'const expect = custom; expect(cy.get(\'.badge\')).to.exist',
      'import { cy } from \'custom\'; expect(cy.get(\'.badge\')).to.exist',
      'import { expect } from \'custom\'; expect(cy.get(\'.badge\')).to.exist',
      'try {} catch (cy) { expect(cy.get(\'.badge\')).to.exist }',
      'cy = client; expect(cy.get(\'.badge\')).to.exist',
      'expect = custom; expect(cy.get(\'.badge\')).to.exist',
      'function check({ cy }) { expect(cy.get(\'.badge\')).to.exist }',
      'function check() { expect(cy.get(\'.badge\')).to.exist; var cy }',
      'expect(cy.get(\'.badge\')).to.be.an(/object/)',
      'expect(cy.get(\'.badge\')).to.be.an(\'object\').and.to.exist',
      'expect(cy.get(\'.badge\')).to.be.an(\'object\').not.to.be.null',
    ].map((code) => ({ code })),
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
      code: 'import { expect } from \'chai\'; expect(cy.get(\'.badge\')).to.exist',
      output: 'import { expect } from \'chai\'; cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(\'.badge\'),).to.exist',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'prepare()\nexpect((cy.get(\'.badge\'))).to.exist',
      output: 'prepare()\ncy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: 'expect(cy.get(/* keep */ \'.badge\')).to.exist',
      output: 'cy.get(/* keep */ \'.badge\').should(\'exist\')',
      errors,
    },
    {
      code: '/* global cy, expect */ expect(cy.get(\'.badge\')).to.exist',
      output: '/* global cy, expect */ cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
    ...[
      'expect(cy.get(\'@value\')).to.exist',
      'expect(cy.get(selector)).to.exist',
      'expect(cy.get(\'@value\').find(\'.badge\')).to.exist',
      'expect(cy.get(\'.badge\').should(\'not.exist\')).to.exist',
      'expect(cy.get(\'.badge\').then(() => null)).to.exist',
      'prepare()\nexpect((cy).get(\'.badge\')).to.exist',
      'expect(/* keep */ cy.get(\'.badge\')).to.exist',
    ].map((code) => ({ code, output: null, errors })),
    {
      code: 'expect(cy.get(\'.badge\')).to.be.an(\'OBJECT\')',
      output: 'cy.get(\'.badge\').should(\'exist\')',
      errors,
    },
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
    // Reported but NOT auto-fixed: choose the intended value assertion manually.
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

const typescriptRuleTester = new RuleTester({
  languageOptions: { parser: require('@typescript-eslint/parser') },
})

typescriptRuleTester.run('no-unnecessary-assertions (TypeScript)', rule, {
  valid: [
    'import type { expect } from \'chai\'; expect(cy.get(\'.badge\')).to.exist',
    'function check(cy: CustomClient) { expect(cy.get(\'.badge\')).to.exist }',
    'expect((cy.get(\'.badge\') as Cypress.Chainable)).to.have.property(\'missing\').and.to.exist',
  ],
  invalid: [
    'expect(cy.get(\'.badge\') as Cypress.Chainable).to.exist',
    'expect(cy.get(\'.badge\')!).to.exist',
    'expect(<Cypress.Chainable>cy.get(\'.badge\')).to.exist',
    'expect(cy.get(\'.badge\') satisfies Cypress.Chainable).to.exist',
  ].map((code) => ({ code, output: null, errors })),
})
