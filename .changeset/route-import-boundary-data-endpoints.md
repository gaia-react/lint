---
"@gaia-react/lint": minor
---

Exempt typed `resources+`/`actions+` data endpoints from the `import-x/no-restricted-paths` architecture boundary. `no-restricted-paths` cannot distinguish a type-only import, so it flagged a UI component's `import type {action}` from a typed data endpoint (the `useFetcher<typeof action>` pattern). The UI layers (pages, components, hooks/state) now carry an `except` for `routes/{actions+,resources+}`; services, utils, and types are deliberately excluded so the carve-out stays within the UI layer.
