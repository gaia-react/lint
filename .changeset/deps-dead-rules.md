---
"@gaia-react/lint": patch
---

Fixed: an unused `eslint-disable` directive now fails a plain `eslint` run at error severity (`linterOptions.reportUnusedDisableDirectives: 'error'`). The `eslint-comments/no-unused-disable` rule it replaces could never report, so the `@eslint-community/eslint-plugin-eslint-comments` dependency is removed. `unicorn/prefer-set-size` and `unicorn/no-blob-to-file` are now off: under the TypeScript parser they cannot report.

Updated: minor and patch releases of `eslint-plugin-perfectionist`, `eslint-plugin-playwright`, `eslint-plugin-sonarjs`, `eslint-plugin-storybook` and `eslint-plugin-no-relative-import-paths`.
