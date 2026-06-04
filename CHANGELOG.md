# @gaia-react/lint

## 1.4.0

### Minor Changes

- [#22](https://github.com/gaia-react/lint/pull/22) [`67be5dd`](https://github.com/gaia-react/lint/commit/67be5dd51b0bd47f86590138c332b66cd50aa079) Thanks [@stevensacks](https://github.com/stevensacks)! - Enable architecture-boundary enforcement. Turn on
  `import-x/no-restricted-paths` at `error` in the `guardrails` layer, scoped to
  the app non-test/story file set (`${sourceDir}/**/!(*.test|*.stories).ts?(x)`).
  No new dependency: `eslint-plugin-import-x` (v4.16.2) is already wired in, and
  airbnb-extended ships this rule `off`, which `guardrails` (spread after `base`)
  now overrides.

  It encodes GAIA's canonical `app/` layout and its import-direction invariant.
  Imports may only flow from a higher layer to a lower one; `types/` is a pure
  leaf importable by everyone:

  ```
  routes -> pages -> components -> { hooks, state } -> services -> utils -> types
  ```

  One zone per lower layer names the higher layers it must not import (collapsed
  with `from` arrays, supported in 4.16.2). Because `routes` is in every `from`
  set, nothing may import a route. `middleware`, `sessions.server`, `assets`,
  `languages`, and `styles` are intentionally left unconstrained.

  Zone `target`/`from` paths resolve against `process.cwd()` (the consuming
  project's root where eslint runs), not this package's location in
  node_modules, so `./${sourceDir}/...` correctly points at the consumer's source
  tree. No `basePath` override is needed. Verified by running eslint against the
  GAIA React reference app: the zones fire on `app/**` files and resolve the `~`
  alias against the consumer root.

  **Downstream impact (loud, but a minor by request):** this is `error`-level and
  catches `import type` as well as value imports, so a consumer whose code
  currently crosses a layer boundary will see a NEW lint failure on upgrade. It
  is not auto-fixable; each hit is a real wrong-direction edge to relocate or an
  inline `eslint-disable` to add deliberately. The reference app surfaced exactly
  one edge across all of `app/`: a component importing a resource-route `action`
  type for `useFetcher<typeof action>()`. Treat such hits as signal, not noise.
  If a consumer relies on resource routes as a typed data-endpoint layer, relax
  only the `components` -> `routes` reach with the rule's `except` option rather
  than downgrading the rule.

- [#20](https://github.com/gaia-react/lint/pull/20) [`056d935`](https://github.com/gaia-react/lint/commit/056d935c63ae57cb9ddc0c119b2802a102680a40) Thanks [@stevensacks](https://github.com/stevensacks)! - Harden the `testing` config with test-discipline rules beyond the
  `@vitest/eslint-plugin` `recommended` preset (all verified against plugin
  v1.6.19). These complement a mechanical TDD RED-verification gate by closing
  test-integrity gaps the gate cannot see on its own.

  Added (error):
  - `consistent-test-it` `{fn: 'test'}` — forbid mixing `test()`/`it()`; GAIA
    uses `test()` exclusively. `fn` cascades to within-describe in 1.6.19.
  - `consistent-vitest-vi` `{fn: 'vi'}` — forbid mixing the `vitest`/`vi` mock
    API; GAIA uses `vi`.
  - `no-test-return-statement` — a returned value/promise can resolve after the
    test "passes", faking GREEN.
  - `no-conditional-in-test` — a branch in a test body can assert nothing on one
    path. (Only this one; `no-conditional-tests` is a byte-identical duplicate.)
  - `no-test-prefixes` — forbid `fdescribe`/`fit`/`xdescribe`/`xit`, which bypass
    the active `no-focused-tests` / `no-disabled-tests` rules.
  - `prefer-todo` — push empty `test('...')` stubs to `test.todo('...')` so
    unimplemented tests are explicit, not silently passing. (Not `warn-todo`,
    which contradicts it.)
  - `require-to-throw-message` — a bare `.toThrow()` passes on any throw; require
    an asserted message or matcher.

  Changed (baseline bump):
  - `no-disabled-tests` `warn` -> `error` — `.skip` is the biggest gaming vector
    for a RED-verification gate. Park work with `test.todo` or an inline
    `eslint-disable`, not a silent `.skip`.

  Downstream impact: these are `error`-level, so projects with existing
  violations may see new lint failures. Most additions are auto-fixable
  (`eslint --fix`); `no-disabled-tests` and `require-to-throw-message` are not.
  Verified zero spurious fires across GAIA's 44 test/story files.

## 1.3.1

### Patch Changes

- [#18](https://github.com/gaia-react/lint/pull/18) [`b25bcfb`](https://github.com/gaia-react/lint/commit/b25bcfb1c204846b53cbf271c674346f329f1b4c) Thanks [@stevensacks](https://github.com/stevensacks)! - Update toolchain dependencies and resolve security advisories.
  - Bump `stylelint-config-clean-order` 8 → 10 (CSS property-ordering updates: logical `inset` properties now sort before their physical equivalents; typography properties repositioned — no API or option changes)
  - Patch-bump `eslint-plugin-prettier`, `@vitest/eslint-plugin`, and `@eslint-community/eslint-plugin-eslint-comments`
  - Resolve transitive advisories: `brace-expansion` → 5.0.6 (GHSA-jxxr-4gwj-5jf2), `fast-uri` → 3.1.2 (GHSA-q3j6-qgpj-74h6, GHSA-v39h-62p7-jpjc)

## 1.3.0

### Minor Changes

- [#15](https://github.com/gaia-react/lint/pull/15) [`6572309`](https://github.com/gaia-react/lint/commit/657230928bb6dc1e5cab9a2d0014356a2a035db1) Thanks [@stevensacks](https://github.com/stevensacks)! - Convert the default export to a `gaiaLint(opts?)` factory. Accepts a
  `sourceDir` option (default `'app'`) that scopes filename conventions,
  hook-folder rules, and `no-relative-import-paths` to the consumer's
  source root — so projects using `src/` (or any other layout) can drop
  in `gaiaLint({sourceDir: 'src'})` without per-rule overrides.

  `includeIgnoreFile` is now imported from `@eslint/config-helpers`
  instead of the deprecated re-export in `@eslint/compat`. `@eslint/compat`
  has been dropped as a dependency.

  `ignores` is now dual-shape: spread it directly for the default case
  (`...lint.ignores`) — `.gitignore` is auto-detected and silently
  no-ops if the resolved path doesn't exist — or call it with options to
  override (`...lint.ignores({extra: ['.gaia/**']})`). Pass
  `{gitignore: false}` to opt out of the gitignore merge entirely, or
  `{gitignore: 'path/...'}` for a non-standard location.

  **Breaking:** the named static config exports (`base`, `react`,
  `styleHygiene`, `guardrails`, `testing`, `storybook`, `playwright`,
  `prettier`, `betterTailwind`, `ignores`) are gone. Access them off the
  bundle returned by the factory:

  ```diff
  - import gaiaLint from '@gaia-react/lint';
  + import gaiaLint from '@gaia-react/lint';
  + const lint = gaiaLint();

    export default defineConfig([
  -   ...gaiaLint.ignores({gitignore: '.gitignore'}),
  -   ...gaiaLint.base,
  -   ...gaiaLint.react,
  +   ...lint.ignores,
  +   ...lint.base,
  +   ...lint.react,
      // ...
    ]);
  ```

### Patch Changes

- [#15](https://github.com/gaia-react/lint/pull/15) [`6572309`](https://github.com/gaia-react/lint/commit/657230928bb6dc1e5cab9a2d0014356a2a035db1) Thanks [@stevensacks](https://github.com/stevensacks)! - Bump `@vitest/eslint-plugin` to 1.6.18 and `typescript-eslint` to 8.60.0.
  No rule-default changes.

## 1.2.0

### Minor Changes

- [#12](https://github.com/gaia-react/lint/pull/12) [`6417611`](https://github.com/gaia-react/lint/commit/641761133e254a50c6b6a42ba5896b7a3eec0bcd) Thanks [@stevensacks](https://github.com/stevensacks)! - Add `no-jsx-iife` rule to `gaiaLint.guardrails`.

  Flags IIFEs (`{(() => { ... })()}`) used inside JSX expression containers. These obscure intent and allocate a new function on every render. The rule errors on both arrow-function and regular-function callees inside a `JSXExpressionContainer`, scoped to `**/*.tsx` and `**/*.jsx` files. Fix by computing the value in a variable before the return statement, using an inline `&&` expression, or extracting a sub-component.

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
