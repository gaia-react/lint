# @gaia-react/lint

## 1.9.0

### Minor Changes

- [#36](https://github.com/gaia-react/lint/pull/36) [`fe262a6`](https://github.com/gaia-react/lint/commit/fe262a630e59913b138368161982c384678bad64) Thanks [@stevensacks](https://github.com/stevensacks)! - Add the `no-zod-enum` guardrail: `z.enum(...)` is now an `error` in `.ts`/`.tsx`. Use `z.literal([...])` for string unions (sort values alphanumerically). Report-only (no autofix), since `z.enum`'s `.enum`/`.options` accessors have no `z.literal` array equivalent and a rename can't sort. Consumers with existing `z.enum()` will see a new lint error on upgrade.

## 1.8.0

### Minor Changes

- [#34](https://github.com/gaia-react/lint/pull/34) [`e66f668`](https://github.com/gaia-react/lint/commit/e66f668a149ef2f3f8d867beeb06ef9df61b88d9) Thanks [@stevensacks](https://github.com/stevensacks)! - Add the `no-null-render` guardrail rule: standardize the empty render on `undefined` instead of `null`.

  In `.tsx`/`.jsx` files, a `return null` inside a function that provably renders JSX (it returns a JSX element elsewhere in the same scope) is now an `error` and is rewritten to `return undefined` by `--fix`. `null` and `undefined` are identical to React's reconciler (both, with `false`/`true`, are the same empty slot), so this is a consistency convention that standardizes on one of two equivalent forms, not a correctness or performance change.

  The autofix is deliberately conservative: it rewrites `return null` only when the enclosing function is provably a render function. A `return null` in a loader, action, or plain utility is never touched, so unsupervised `--fix` cannot change non-render runtime behavior. `: null` ternary arms stay out of scope (covered report-only by the existing `no-restricted-syntax` selectors).

  Wired into `guardrails`, scoped to `.tsx`/`.jsx`. A consumer with a `return null` in a render function will see a NEW auto-fixable lint error on upgrade.

  Also flag the most common numeric-`0` leak via `no-restricted-syntax`: a `.length && <JSX/>` conditional render. A `.length` left operand is always numeric, so `&&` leaks the literal `0` into the DOM when the list is empty; the fix is `items.length > 0 && <JSX/>`. This selector is report-only (no autofix) and has zero false positives. The general `count && <JSX/>` case is still not caught, because any expression could be numeric.

- [#34](https://github.com/gaia-react/lint/pull/34) [`e66f668`](https://github.com/gaia-react/lint/commit/e66f668a149ef2f3f8d867beeb06ef9df61b88d9) Thanks [@stevensacks](https://github.com/stevensacks)! - Refresh quarantined toolchain dependencies.
  - `eslint-plugin-sonarjs` 4.0.3 → 4.1.0. This is a runtime dependency whose recommended rules this config spreads, so consumers may see new SonarJS findings on upgrade. Most are auto-fixable; treat them as signal.
  - `typescript-eslint` 8.61.1 → 8.62.0. Held at 8.62.0 deliberately: 8.62.1 has not yet cleared the 7-day release-age quarantine, so 8.62.0 is the newest version that installs cleanly under a downstream release-age policy. A later release picks up 8.62.1 once it ages out.

  Both bumps have cleared the 7-day release-age quarantine, so each installs cleanly with no new release-age exclusions required.

## 1.7.0

### Minor Changes

- [#32](https://github.com/gaia-react/lint/pull/32) [`55bb692`](https://github.com/gaia-react/lint/commit/55bb6924fc90353f774dd9b7cf2b1b7d3042e8ba) Thanks [@stevensacks](https://github.com/stevensacks)! - Flag rendering `null` from a JSX ternary via `no-restricted-syntax`.

  `cond ? <JSX/> : null` and `cond ? null : <JSX/>` are now `error`-level. Both
  are the boolean-guarded `&&` render guard written the long way; use
  `cond && <JSX/>` instead (coerce a numeric/falsy guard with `!!cond` so the
  `0` value can't leak into the output).

  The selectors are flag-only, with no autofix: a blind `? : null` → `&&` rewrite
  is unsafe because numeric-`0` guards need `!!`, `??`-fed values need
  `: undefined`, and `||`-guards need per-operand coercion. A human applies the
  fix the selector points to.

  Both selectors only match a `JSXElement`/`JSXFragment` branch, so they are
  inert outside `.tsx`/`.jsx`. All `no-restricted-syntax` selectors are
  consolidated into one `gaia/no-restricted-syntax` config object, because ESLint
  flat config merges that rule key by replacement (last match wins), not
  concatenation.

  A consumer with a `cond ? <JSX/> : null` ternary will see a NEW lint failure on
  upgrade. That is the intent: convert it to `&&`.

## 1.6.0

### Minor Changes

- [#29](https://github.com/gaia-react/lint/pull/29) [`e7a2232`](https://github.com/gaia-react/lint/commit/e7a22321603248e5bf4790926677762581c0967c) Thanks [@stevensacks](https://github.com/stevensacks)! - Add two test-honesty lint rules and enforce error-only severity in the test config (no `warn`).
  - **`vitest/prefer-called-with` (error)** — a bare `toHaveBeenCalled()`/`toBeCalled()` proves a function ran but asserts nothing about arguments or count; require the `*With` form. Exempts the `.not` form.
  - **`no-restricted-imports` in test/story files (error)** — consumer test, story, and harness files may not import a server-only (`*.server`) or internal (`**/internals/**`) module; reach the behavior through the public interface instead. A dedicated `*.server.test.*` file is exempt (the right place to import a `.server` module). Covers static `import` / `export … from` only, not dynamic `import()`.
  - **`playwright/expect-expect` promoted `warn` → `error`** — a Playwright test that asserts nothing is a false green. Custom `expect*()` helpers still count via `assertFunctionPatterns`.

  Consumers on `--max-warnings=0` already treated the prior `warn` as blocking, so this only makes the intent explicit. Expect new errors on bare `toHaveBeenCalled()` and on server/internal imports from consumer tests — treat them as signal.

- [#28](https://github.com/gaia-react/lint/pull/28) [`b05f445`](https://github.com/gaia-react/lint/commit/b05f4459af8742f995c36e6fee67fa598ec53006) Thanks [@stevensacks](https://github.com/stevensacks)! - Refresh the quarantined toolchain dependencies.
  - `eslint-plugin-unicorn` 64 → 65. Held at 65 deliberately: unicorn 66 requires ESLint 10.4, and this config stays on ESLint 9 until that migration is coordinated with the consuming app. Unicorn 65 adds a large batch of rules to its `recommended` preset, which this config spreads, so consumers will see new unicorn findings on upgrade. Most are auto-fixable; treat them as signal.
  - `unicorn/prefer-includes-over-repeated-comparisons` is disabled. `Array#includes` returns a plain boolean, not a type predicate, so it cannot narrow a union the way an `===` comparison chain does. In a typed codebase the chain is the type-safe idiom; forcing `.includes()` discards the narrowing and the refined type of the value along with it. This joins the config's existing set of disabled unicorn opinions that fight idiomatic typed React.
  - `eslint-plugin-storybook` 10.4.2 → 10.4.6.
  - `@vitest/eslint-plugin` 1.6.19 → 1.6.20.
  - `eslint-plugin-better-tailwindcss` 4.5.0 → 4.6.0.
  - `eslint-plugin-perfectionist` 5.9.0 → 5.9.1.

  Every bump has cleared the 7-day release-age quarantine, so each installs cleanly under a downstream release-age policy with no new `trustPolicyExclude` entries.

- [#31](https://github.com/gaia-react/lint/pull/31) [`178157f`](https://github.com/gaia-react/lint/commit/178157f1bfb594953c2016bbe58f4b905b6d897e) Thanks [@stevensacks](https://github.com/stevensacks)! - Exempt typed `resources+`/`actions+` data endpoints from the `import-x/no-restricted-paths` architecture boundary. `no-restricted-paths` cannot distinguish a type-only import, so it flagged a UI component's `import type {action}` from a typed data endpoint (the `useFetcher<typeof action>` pattern). The UI layers (pages, components, hooks/state) now carry an `except` for `routes/{actions+,resources+}`; services, utils, and types are deliberately excluded so the carve-out stays within the UI layer.

## 1.5.1

### Patch Changes

- [#26](https://github.com/gaia-react/lint/pull/26) [`3206a92`](https://github.com/gaia-react/lint/commit/3206a92ec099eb7ddd4a296ec95a9ff27201fb2e) Thanks [@stevensacks](https://github.com/stevensacks)! - Bump `eslint-plugin-storybook` to 10.4.2.

  The package now adopts the same supply-chain hardening as the consuming app: a 7-day release-age quarantine (`minimumReleaseAge`) and pnpm `trustPolicy: no-downgrade`. Because the config can only ever pin dependencies that have already cleared the 7-day window, every published release installs cleanly under a downstream release-age policy with no per-dependency exclusions required.

## 1.5.0

### Minor Changes

- [#23](https://github.com/gaia-react/lint/pull/23) [`f6a26b9`](https://github.com/gaia-react/lint/commit/f6a26b9b4b4894def3cc04a96896cc8d5fce33a7) Thanks [@stevensacks](https://github.com/stevensacks)! - Enforce `@typescript-eslint/ban-ts-comment` at `error` in the `base` layer
  (previously explicitly `off`). `tsc` is the type oracle every consumer relies
  on, and `@ts-ignore` / `@ts-nocheck` silence its errors instead of fixing them,
  which is exactly the escape hatch an AI agent reaches for to turn red green.
  Closing it keeps the oracle honest.

  The rule is configured to ban the holes outright while keeping the good
  pattern:
  - `ts-ignore: true` — banned. `@ts-ignore` suppresses unconditionally and does
    nothing if the next line is already error-free, so it silently rots.
  - `ts-nocheck: true` — banned. Whole-file `@ts-nocheck` opts an entire module
    out of type checking.
  - `ts-expect-error: 'allow-with-description'` — kept. Unlike `@ts-ignore` it
    self-removes (errors) once the underlying type error disappears, so it can't
    go stale. A reason is now required.
  - `minimumDescriptionLength: 10` — the `@ts-expect-error` reason must be at
    least 10 characters, so "fix later" doesn't count.
  - `ts-check: false` — `@ts-check` opts _into_ stricter checking; no reason to
    restrict it.

  This is `error`-level and applies to all `.ts?(x)` files, including `.d.ts`
  (no exemption is baked into the shared config). A consumer with an existing
  `@ts-ignore`/`@ts-nocheck`, or an undescribed `@ts-expect-error`, will see a
  NEW lint failure on upgrade. That is the intent: replace each `@ts-ignore` with
  a described `@ts-expect-error`, or fix the underlying type error. Treat the hits
  as signal.

  Verified against the GAIA React reference app: zero spurious fires. The
  React Router typegen output (`.react-router/types/**`) is `.gitignore`-merged
  out of linting and carries no ts-comments, and the app's hand-written `.d.ts`
  is clean, so no consumer-side override is needed. Should a consumer's generated
  output ever emit ts-comments, scope the exemption in that consumer's own eslint
  config rather than weakening this shared rule.

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
