'use strict'

const rule = require('../../../lib/rules/assertion-before-screenshot')
const { FlatRuleTester } = require('eslint/use-at-your-own-risk')

const ruleTester = new FlatRuleTester()

const errors = [{ messageId: 'unexpected' }]
const languageOptions = { ecmaVersion: 6 }

ruleTester.run('assertion-before-screenshot', rule, {
  valid: [
    { code: 'cy.get(".some-element"); cy.screenshot();', languageOptions },
    { code: 'cy.get(".some-element").should("exist").screenshot();', languageOptions },
    { code: 'cy.get(".some-element").should("exist").screenshot().click()', languageOptions, errors },
    { code: 'cy.get(".some-element").should("exist"); if(true) cy.screenshot();', languageOptions },
    { code: 'if(true) { cy.get(".some-element").should("exist"); cy.screenshot(); }', languageOptions },
    { code: 'cy.get(".some-element").should("exist"); if(true) { cy.screenshot(); }', languageOptions },
    { code: 'const a = () => { cy.get(".some-element").should("exist"); cy.screenshot(); }', languageOptions, errors },
    { code: 'cy.get(".some-element").should("exist").and("be.visible"); cy.screenshot();', languageOptions },
    { code: 'cy.get(".some-element").contains("Text"); cy.screenshot();', languageOptions },
  ],

  invalid: [
    { code: 'cy.screenshot()', languageOptions, errors },
    { code: 'cy.visit("somepage"); cy.screenshot();', languageOptions, errors },
    { code: 'cy.custom(); cy.screenshot()', languageOptions, errors },
    { code: 'cy.get(".some-element").click(); cy.screenshot()', languageOptions, errors },
    { code: 'cy.get(".some-element").click().screenshot()', languageOptions, errors },
    { code: 'if(true) { cy.get(".some-element").click(); cy.screenshot(); }', languageOptions, errors },
    { code: 'cy.get(".some-element").click(); if(true) { cy.screenshot(); }', languageOptions, errors },
    { code: 'cy.get(".some-element"); function a() { cy.screenshot(); }', languageOptions, errors },
    { code: 'cy.get(".some-element"); const a = () => { cy.screenshot(); }', languageOptions, errors },
  ],
})
