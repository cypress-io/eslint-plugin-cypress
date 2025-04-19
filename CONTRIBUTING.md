# Contributing to cypress-io/eslint-plugin-cypress

Thanks for taking the time to contribute! :smile:

## Preparation

* Fork and clone this repository
* Branch from the default `master` branch using a descriptive new branch name
* Install dependencies with `npm ci`

## Rule references

* Refer to the [ESLint documentation](https://eslint.org/docs/latest/) and the [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) page

## New rule

To add a new rule:

* Follow the instructions in the ESLint [generator-eslint](https://www.npmjs.com/package/generator-eslint) documentation to install [Yeoman](https://www.npmjs.com/package/yo) and the generator
* Run the new rule generator `yo eslint:rule` and answer the questions
  - select "ESLint Plugin"
  - for "Type a short description of this rule" provide text which starts with one of "enforce", "require" or "disallow" (all lower case)
* Yeoman creates three boilerplate files:
  - `docs/rules/<rule-id>.md`
  - `lib/rules/<rule-id>.js`
  - `test/rules/<rule-id>.js`
* Run `npm run lint-fix`
* Address the linting errors by editing `lib/rules/<rule-id>.js`
  - Add a `meta.messages` property (see [MessageIds](https://eslint.org/docs/latest/extend/custom-rules#messageids))
  - Select the appropriate `meta.type` property using `problem`, `suggestion`, or `layout`
* Complete the new rule by adding content to the three files previously created
* Run `eslint-doc-generator` to generate automated documentation sections (see [Document generation](#document-generation) below)
* Review documentation changes
* Run `npm run lint`
* Run `npm test` to run [Jest](https://jestjs.io/) (or run `npm start` to run [Jest](https://jestjs.io/) in [watchAll](https://jestjs.io/docs/cli#--watchall) mode where it remains active and reruns when source changes are made)
* Make sure all tests are passing
* Add the rule to [legacy.js](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/legacy.js) and to [flat.js](https://github.com/cypress-io/eslint-plugin-cypress/blob/master/lib/flat.js)
* Create a git commit with a commit message similar to: `feat: add rule <description>` (see [commit message conventions](https://github.com/semantic-release/semantic-release#commit-message-format))
* Create a PR from your branch

## Document generation

This plugin uses the ESLint [eslint-doc-generator](https://www.npmjs.com/package/eslint-doc-generator) to generate consistent documentation.
* Install with `npm install eslint-doc-generator -g`
* Run `eslint-doc-generator` in the root directory of the plugin

## Legacy tests

* The directory [tests-legacy](https://github.com/cypress-io/eslint-plugin-cypress/tree/master/tests-legacy) contains tests which are compatible with the legacy [ESLint v8 RuleTester](https://eslint.org/docs/v8.x/integrate/nodejs-api#ruletester) utility. It is not expected to add new rules to this set of tests.
* The directory [tests](https://github.com/cypress-io/eslint-plugin-cypress/tree/master/tests) is for tests compatible with the current [ESLint RuleTester](https://eslint.org/docs/latest/integrate/nodejs-api#ruletester).

## Merging pull requests

This information is for Cypress.io Members or Collaborators who merge pull requests:

1. When merging a pull request, use the [Squash and merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits) option to squash all commits into one.
1. Make sure the commit subject and body follow [semantic commit convention](https://semantic-release.gitbook.io/semantic-release/#commit-message-format), for instance:

   ```text
   feat: added new parameter
   fix: fixed a bug
   ```

   If you need to bump the major version, mark it as breaking change in the body of the commit's message like:

   ```text
   fix: upgrade dependency X

   BREAKING CHANGE: requires minimum Node.js 20 to run
   ```

1. New versions of this module will be released automatically by the CI pipeline when any PR with a triggering commit message is merged to the `master` branch: see the `release` job of [circle.yml](circle.yml).
This will create a new [GitHub release](https://github.com/cypress-io/eslint-plugin-cypress/releases) and publish it to [eslint-plugin-cypress](https://www.npmjs.com/package/eslint-plugin-cypress) on the [npm registry](https://docs.npmjs.com/about-the-public-npm-registry).
1. The module's CI is configured to use the [default Angular release rules](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js).
This means that only `feat:`, `fix:` and `perf:` trigger a new release.
Other Angular commit types listed in the [Angular commit message guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) can be used for documentation purposes, however they are ignored by the currently configured release process.
