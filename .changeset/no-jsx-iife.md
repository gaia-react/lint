---
"@gaia-react/lint": minor
---

Add `no-jsx-iife` rule to `gaiaLint.guardrails`.

Flags IIFEs (`{(() => { ... })()}`) used inside JSX expression containers. These obscure intent and allocate a new function on every render. The rule errors on both arrow-function and regular-function callees inside a `JSXExpressionContainer`, scoped to `**/*.tsx` and `**/*.jsx` files. Fix by computing the value in a variable before the return statement, using an inline `&&` expression, or extracting a sub-component.
