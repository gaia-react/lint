---
"@gaia-react/lint": minor
---

Enable architecture-boundary enforcement. Turn on
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
