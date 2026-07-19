---
'@gaia-react/lint': minor
---

Ban the bare `@conform-to/zod` import specifier via `no-restricted-imports` in the base config. The bare specifier targets Zod v3 and throws at RUNTIME — uncaught by typecheck, lint, and build — so a wrong import previously shipped silently and only failed in the running app. Import from `@conform-to/zod/v4` instead. The ban uses exact-match `paths`, so the distinct `@conform-to/zod/v4` specifier is unaffected; test and story files keep the ban alongside their existing server-only/`internals` import restrictions. Consumers with a bare `@conform-to/zod` import will see a new lint error on upgrade.
