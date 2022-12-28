## No Unecessary actionability check

When Cypress actions already implement actionability checks implicitly, it's unecessary to explicitly write them. Writing repeated checks is both uncessary and increases chance of getting element detached from DOM.

For example,

```
cy.get("button").should("be.visible").click();
```

Can be simplified:

```
cy.get("button").click();
```

See more at [Actionability](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Actionability)