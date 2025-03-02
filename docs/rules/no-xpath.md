# Disallow usage of cypress xpath (`no-xpath`)

This rule disallow the usage of cypress-xpath for selecting elements.


Examples of **incorrect** code for this rule:

```js

cy.xpath('//div[@class=\"container\"]').click()
```

Examples of **correct** code for this rule:


```js

cy.get('[data-cy="container"]').click();
```


## Further Reading

`cypress-xpath` package has been deprecated since Oct 13, 2022.


See [the Cypress Best Practices guide](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements).
