## Assertion Before percySnapshot

If you capture [Percy Snapshots](https://docs.percy.io/docs/cypress) without assertions then you may get different snapshots depending on timing.

For example, if clicking a button makes some network calls and upon success, renders something, then the snapshot may sometimes have the new render and sometimes not.

This rule checks there is an assertion making sure your application state is correct before taking a snapshot. This makes sure the result of the snapshot will be consistent.

Invalid:

```
cy.visit('myUrl');
cy.percySnapshot();
```

Valid:

```
cy.visit('myUrl');
cy.get('[data-test-id="my-element"]').should('be.visible');
cy.percySnapshot();
```
