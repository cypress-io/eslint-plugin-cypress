import type { ESLint, Linter } from 'eslint'

declare const plugin: {
  meta: { name: string, version: string }
  configs: {
    globals: Linter.Config<Linter.RulesRecord>
    recommended: Linter.Config<Linter.RulesRecord>
  }
  rules: NonNullable<ESLint.Plugin['rules']>
}

export = plugin
