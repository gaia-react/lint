# @gaia-react/lint

## 1.1.3

### Patch Changes

- [#10](https://github.com/gaia-react/lint/pull/10) [`1c87c49`](https://github.com/gaia-react/lint/commit/1c87c49b35eaf021e1dac5d916bbb16ef0c5da2c) Thanks [@stevensacks](https://github.com/stevensacks)! - Fix `gaiaLint.testing` files glob and configure `expect-expect` rules to recognize `expect*` helpers.

  **Glob fix.** The vitest block was scoped to `['*.test.ts?(x)', '*.stories.ts?(x)', 'test/**/*.ts?(x)']` — the first two patterns lack the `**/` prefix needed to match nested paths in ESLint flat config, so none of the vitest, jest-dom, or `import-x/no-useless-path-segments` rules fired on files like `app/components/Button/tests/index.test.tsx`. Verified via `eslint --print-config` against a nested test: `vitest/*` and `jest-dom/*` rules were absent from the effective config; the no-useless-path rule resolved to severity 0 (off, inherited from base) instead of error. Sibling `testing-library` block was unaffected (already correctly scoped to `['**/*.test.ts?(x)']`).

  **Helper-aware `expect-expect`.** Once the glob is fixed, `vitest/expect-expect` (severity error) starts flagging tests that delegate their assertion to a helper — e.g. `await expectNoA11yViolations(container)`, where the `expect()` call lives inside the helper. Same pattern surfaces for `playwright/expect-expect` against `expectNoSeriousA11yViolations(page)`. Both rules now whitelist functions matching `/^expect[A-Z]/`, so any `expect*` helper following the project's naming convention satisfies the rule without per-test disable directives.

  Effect after upgrading: `pnpm lint --fix` rewrites `import X from '../index'` → `import X from '..'` for every component test, previously-silent vitest/jest-dom rule violations on nested tests start surfacing, and a11y/e2e helpers that internally assert no longer trip `expect-expect`.

## 1.1.2

### Patch Changes

- [#8](https://github.com/gaia-react/lint/pull/8) [`2f5a18d`](https://github.com/gaia-react/lint/commit/2f5a18d1e69f830e69ce70dccf1545e45a22ac1a) Thanks [@stevensacks](https://github.com/stevensacks)! - Enable `import-x/no-useless-path-segments` with `noUselessIndex: true` in the testing config.

  Auto-rewrites `import X from '../index'` → `import X from '..'` on `pnpm lint --fix` for `*.test.ts?(x)`, `*.stories.ts?(x)`, and `test/**/*.ts?(x)`. Aligns with GAIA's `Component/index.tsx` + `Component/tests/index.test.tsx` convention where sibling-index imports are intentional. Globally scoped `import-x/no-useless-path-segments` remains off in the base config.

## 1.1.1

### Patch Changes

- [#6](https://github.com/gaia-react/lint/pull/6) [`efebb80`](https://github.com/gaia-react/lint/commit/efebb803e690076133ab1c0c9f9ab5adb8ee9cd4) Thanks [@stevensacks](https://github.com/stevensacks)! - Close `prefer-arrow-functions` upstream gap for `export default function NamedFn(){}` via `no-restricted-syntax` selector.

  The `eslint-plugin-prefer-arrow-functions` plugin has a hardcoded exemption (`guard.js:hasNameAndIsExportedAsDefaultExport`) that silently passes named default-exported declarations regardless of `allowNamedFunctions` setting. This release adds a `no-restricted-syntax` rule with selector `ExportDefaultDeclaration > FunctionDeclaration` to flag the pattern. Convert to `const Name = () => {}; export default Name;` instead. Ignored on `**/*.d.ts` since ambient declarations have no body to convert.

## 1.1.0

### Minor Changes

- [`ebad2d3`](https://github.com/gaia-react/lint/commit/ebad2d32c55656ea7a29bf764eaf536db4ccef81) Thanks [@stevensacks](https://github.com/stevensacks)! - Add Prettier and Stylelint config subpath exports.
  - `@gaia-react/lint/prettier` — Prettier engine config (singleQuote, no bracket spacing, ES5 trailing commas, experimental ternaries, Tailwind class-sorting via `prettier-plugin-tailwindcss` for `twJoin`/`twMerge`).
  - `@gaia-react/lint/stylelint` — Stylelint config extending `stylelint-config-standard` + `stylelint-config-clean-order` + `stylelint-config-tailwindcss`, with `stylelint-order` plugin and GAIA-specific overrides for CSS modules.

  Consumer usage:

  ```js
  // prettier.config.mjs
  export {default} from '@gaia-react/lint/prettier';

  // stylelint.config.mjs
  export {default} from '@gaia-react/lint/stylelint';
  ```

  `stylelint` joins `eslint`/`prettier`/`typescript` as a peer dependency (optional; only required if you import the stylelint subpath).
