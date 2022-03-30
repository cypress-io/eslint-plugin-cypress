# Disallow registration of custom commands with duplicate names (no-duplicate-commands)

When working in a large codebases with several Cypress suites and lots and lots of custom 
commands - some shared across modules, others not - it is useful to be able to flag 
whether a command has already been registered elsewhere in the codebase, as the over-writing 
of one of the commands (without using `Cypress.Commands.overwrite`) can be confusing to debug.

## Rule Details

This rule aims to prevent registration of custom commands with duplicate names.

Examples of **incorrect** code for this rule:

```js
// in one command file
Cypress.Commands.add("foo", () => {
  cy.get('bar');
});

// in the same file, or another (Commands can be registered anywhere...)
Cypress.Commands.add("foo", () => {
  cy.get('not-bar');
});
```
