---
"@gaia-react/lint": minor
---

Enforce `@typescript-eslint/ban-ts-comment` at `error` in the `base` layer
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
- `ts-check: false` — `@ts-check` opts *into* stricter checking; no reason to
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
