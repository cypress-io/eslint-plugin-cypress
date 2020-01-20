## Assertion Before percySnapshot

If you take percySnapshots without assertions then you may get different percySnapshots depending on timing.

For example, if clicking a button makes some network calls and upon success, renders something, then the percySnapshot may sometimes have the new render and sometimes not.

This rule checks there is an assertion making sure your application state is correct before doing a percySnapshot. This makes sure the result of the percySnapshot will be consistent.

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
