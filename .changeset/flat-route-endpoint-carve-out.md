---
"@gaia-react/lint": minor
---

`guardrails`'s architecture-boundary carve-out now exempts flat `actions.*` and `resources.*` route files, matching `@react-router/fs-routes`'s dot-delimited naming. The older `actions+`/`resources+` group-folder spelling is still accepted, so projects on either layout keep passing without a config change.
