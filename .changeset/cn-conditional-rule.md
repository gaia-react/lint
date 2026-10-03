---
"@gaia-react/lint": minor
---

Add a `cn-conditional` guardrails rule that reports object and `&&`/`||`/`??` conditionals passed to `cn` from the `cn` package, so a conditional class is written as `cond ? 'class' : undefined`. It keys on the `cn` import from `'cn'` and stays active in test and story files. Add `cn` to the Prettier config's `tailwindFunctions` so classes inside `cn(...)` sort like `twJoin` and `twMerge`, which stay in the list.
