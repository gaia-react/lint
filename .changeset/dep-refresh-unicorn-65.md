---
"@gaia-react/lint": minor
---

Refresh the quarantined toolchain dependencies.

- `eslint-plugin-unicorn` 64 → 65. Held at 65 deliberately: unicorn 66 requires ESLint 10.4, and this config stays on ESLint 9 until that migration is coordinated with the consuming app. Unicorn 65 adds a large batch of rules to its `recommended` preset, which this config spreads, so consumers will see new unicorn findings on upgrade. Most are auto-fixable; treat them as signal.
- `unicorn/prefer-includes-over-repeated-comparisons` is disabled. `Array#includes` returns a plain boolean, not a type predicate, so it cannot narrow a union the way an `===` comparison chain does. In a typed codebase the chain is the type-safe idiom; forcing `.includes()` discards the narrowing and the refined type of the value along with it. This joins the config's existing set of disabled unicorn opinions that fight idiomatic typed React.
- `eslint-plugin-storybook` 10.4.2 → 10.4.6.
- `@vitest/eslint-plugin` 1.6.19 → 1.6.20.
- `eslint-plugin-better-tailwindcss` 4.5.0 → 4.6.0.
- `eslint-plugin-perfectionist` 5.9.0 → 5.9.1.

Every bump has cleared the 7-day release-age quarantine, so each installs cleanly under a downstream release-age policy with no new `trustPolicyExclude` entries.
