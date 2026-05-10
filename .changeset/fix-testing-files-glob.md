---
"@gaia-react/lint": patch
---

Fix `gaiaLint.testing` files glob and configure `expect-expect` rules to recognize `expect*` helpers.

**Glob fix.** The vitest block was scoped to `['*.test.ts?(x)', '*.stories.ts?(x)', 'test/**/*.ts?(x)']` — the first two patterns lack the `**/` prefix needed to match nested paths in ESLint flat config, so none of the vitest, jest-dom, or `import-x/no-useless-path-segments` rules fired on files like `app/components/Button/tests/index.test.tsx`. Verified via `eslint --print-config` against a nested test: `vitest/*` and `jest-dom/*` rules were absent from the effective config; the no-useless-path rule resolved to severity 0 (off, inherited from base) instead of error. Sibling `testing-library` block was unaffected (already correctly scoped to `['**/*.test.ts?(x)']`).

**Helper-aware `expect-expect`.** Once the glob is fixed, `vitest/expect-expect` (severity error) starts flagging tests that delegate their assertion to a helper — e.g. `await expectNoA11yViolations(container)`, where the `expect()` call lives inside the helper. Same pattern surfaces for `playwright/expect-expect` against `expectNoSeriousA11yViolations(page)`. Both rules now whitelist functions matching `/^expect[A-Z]/`, so any `expect*` helper following the project's naming convention satisfies the rule without per-test disable directives.

Effect after upgrading: `pnpm lint --fix` rewrites `import X from '../index'` → `import X from '..'` for every component test, previously-silent vitest/jest-dom rule violations on nested tests start surfacing, and a11y/e2e helpers that internally assert no longer trip `expect-expect`.
