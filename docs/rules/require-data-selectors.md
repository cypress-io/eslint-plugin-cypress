# cypress/require-data-selectors

📝 Require `data-*` attribute selectors.

<!-- end auto-generated rule header -->

Require `cy.get` to use only selectors that target `data-*` attributes.

> Note: If you use this rule, consider only using the `warn` error level, since using `data-*` attribute selectors may not always be possible.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.get('.a')
cy.get('[daedta-cy=submit]').click()
cy.get('[d-cy=submit]')
cy.get('.btn-large').click()
cy.get('.btn-.large').click()

const CLASS_SELECTOR = ".my-class"; 
cy.get(CLASS_SELECTOR)

const TYPE = 'submit'
const SUBMIT_TEMPLATE = `.${TYPE}`
cy.get(SUBMIT_TEMPLATE)

const MY_SUBMIT_TEMPLATE = SUBMIT_TEMPLATE;
cy.get(MY_SUBMIT_TEMPLATE)
```

Examples of **correct** code for this rule:

```js
cy.get('[data-cy=submit]').click()
cy.get('[data-QA=submit]')
cy.get(`[data-QA=submit]`)

const ASSESSMENT_SUBMIT = "[data-cy=assessment-submit]"
cy.get(ASSESSMENT_SUBMIT).click()

const TYPE = 'submit'
const SUBMIT_TEMPLATE = `[data-QA=${TYPE}]`
cy.get(SUBMIT_TEMPLATE)

const MY_SUBMIT_TEMPLATE = SUBMIT_TEMPLATE;
cy.get(MY_SUBMIT_TEMPLATE)
```

## Further Reading

See [the Cypress Best Practices guide](https://docs.cypress.io/app/core-concepts/best-practices.html#Selecting-Elements).
