---
'@gaia-react/lint': minor
---

Add the `no-zod-enum` guardrail: `z.enum(...)` is now an `error` in `.ts`/`.tsx`. Use `z.literal([...])` for string unions (sort values alphanumerically). Report-only (no autofix), since `z.enum`'s `.enum`/`.options` accessors have no `z.literal` array equivalent and a rename can't sort. Consumers with existing `z.enum()` will see a new lint error on upgrade.
