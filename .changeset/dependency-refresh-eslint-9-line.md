---
"@gaia-react/lint": minor
---

Refresh every bundled plugin that still supports the ESLint 9 line. No config authored here changes; the new rules arrive through `recommended` presets this config spreads.

Twelve rules land at error severity that were not enabled before. Eleven come from `eslint-plugin-sonarjs` 4.1.0 → 4.2.0, whose `recommended` preset `guardrails` spreads wholesale: `assertions-in-test-cases`, `explicit-test-skip`, `memoize-cache-key`, `no-debug-commands-in-ui-tests`, `no-default-utility-imports`, `no-fixed-wait-in-tests`, `no-interpolation-in-inline-snapshots`, `no-mixed-completion-style`, `parameterized-tests`, `prefer-native-lodash-alternative`, and `synchronous-suite-callback`. The twelfth is `playwright/no-unnecessary-assertions`, added to `flat/recommended` in `eslint-plugin-playwright` 2.11.0 and therefore live under `.playwright/`. Despite the test-flavored names, the SonarJS rules ship in the base `recommended` set rather than a test-scoped one, so they resolve for every linted file, not only specs.

`eslint-config-airbnb-extended` 3.1.0 → 3.2.0 only relaxes: `drizzle.config.*` joins the `import-x/no-extraneous-dependencies` devDependencies allowlist, so a Drizzle config importing a devDependency stops erroring.

Consumers will see new lint errors on upgrade, though the count should be small and concentrated in test files; none of the twelve is auto-fixable, so each needs a real edit or a deliberate suppression. Measured against GAIA's own tree, the whole set produced three findings, all `sonarjs/parameterized-tests` flagging adjacent tests that differ only by input.

Also refreshed, with no effective rule change: `@eslint/config-helpers`, `@vitest/eslint-plugin`, `eslint-plugin-better-tailwindcss`, `eslint-plugin-check-file`, `eslint-plugin-jest-dom`, `eslint-plugin-perfectionist`, `eslint-plugin-prefer-arrow-functions`, `eslint-plugin-storybook`, and `prettier-plugin-tailwindcss`.

`eslint-plugin-storybook` 10.4.6 → 10.5.7 tightens its own peer on `storybook` to `^10.5.7`. A project on an earlier Storybook 10.5.x will see an unmet-peer warning until it bumps; the plugin's rules work regardless, and the warning is not fatal unless `strictPeerDependencies` is on.

ESLint stays on the 9 line. `eslint` 10, `@eslint/js` 10, and `eslint-plugin-unicorn` 73 (which peers `eslint >=10.4`) all require widening the `eslint` peer range, so they belong to a major release rather than this one. TypeScript 7 is blocked independently: `typescript-eslint` 8.x peers `typescript <6.1.0`.
