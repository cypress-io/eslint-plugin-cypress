'use strict'

const rule = require('../../../lib/rules/assertion-before-percySnapshot')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]
const parserOptions = { ecmaVersion: 6 }

ruleTester.run('assertion-before-percySnapshot', rule, {
  valid: [
    { code: 'cy.get(".some-element"); cy.percySnapshot();', parserOptions },
    { code: 'cy.get(".some-element").should("exist").percySnapshot();', parserOptions },
    { code: 'cy.get(".some-element").should("exist").percySnapshot().click()', parserOptions, errors },
    { code: 'cy.get(".some-element").should("exist"); if(true) cy.percySnapshot();', parserOptions },
    { code: 'if(true) { cy.get(".some-element").should("exist"); cy.percySnapshot(); }', parserOptions },
    { code: 'cy.get(".some-element").should("exist"); if(true) { cy.percySnapshot(); }', parserOptions },
    { code: 'const a = () => { cy.get(".some-element").should("exist"); cy.percySnapshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element").should("exist").and("be.visible"); cy.percySnapshot();', parserOptions },
    { code: 'cy.get(".some-element").contains("Text"); cy.percySnapshot();', parserOptions },
  ],

  invalid: [
    { code: 'cy.percySnapshot()', parserOptions, errors },
    { code: 'cy.visit("somepage"); cy.percySnapshot();', parserOptions, errors },
    { code: 'cy.custom(); cy.percySnapshot()', parserOptions, errors },
    { code: 'cy.get(".some-element").click(); cy.percySnapshot()', parserOptions, errors },
    { code: 'cy.get(".some-element").click().percySnapshot()', parserOptions, errors },
    { code: 'if(true) { cy.get(".some-element").click(); cy.percySnapshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element").click(); if(true) { cy.percySnapshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element"); function a() { cy.percySnapshot(); }', parserOptions, errors },
    { code: 'cy.get(".some-element"); const a = () => { cy.percySnapshot(); }', parserOptions, errors },
  ],
})
