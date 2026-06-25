---
"@gaia-react/lint": minor
---

Flag rendering `null` from a JSX ternary via `no-restricted-syntax`.

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
