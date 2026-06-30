---
'@gaia-react/lint': minor
---

Add the `no-null-render` guardrail rule: standardize the empty render on `undefined` instead of `null`.

In `.tsx`/`.jsx` files, a `return null` inside a function that provably renders JSX (it returns a JSX element elsewhere in the same scope) is now an `error` and is rewritten to `return undefined` by `--fix`. `null` and `undefined` are identical to React's reconciler (both, with `false`/`true`, are the same empty slot), so this is a consistency convention that standardizes on one of two equivalent forms, not a correctness or performance change.

The autofix is deliberately conservative: it rewrites `return null` only when the enclosing function is provably a render function. A `return null` in a loader, action, or plain utility is never touched, so unsupervised `--fix` cannot change non-render runtime behavior. `: null` ternary arms stay out of scope (covered report-only by the existing `no-restricted-syntax` selectors).

Wired into `guardrails`, scoped to `.tsx`/`.jsx`. A consumer with a `return null` in a render function will see a NEW auto-fixable lint error on upgrade.

Also flag the most common numeric-`0` leak via `no-restricted-syntax`: a `.length && <JSX/>` conditional render. A `.length` left operand is always numeric, so `&&` leaks the literal `0` into the DOM when the list is empty; the fix is `items.length > 0 && <JSX/>`. This selector is report-only (no autofix) and has zero false positives. The general `count && <JSX/>` case is still not caught, because any expression could be numeric.
