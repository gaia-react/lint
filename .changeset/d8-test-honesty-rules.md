---
"@gaia-react/lint": minor
---

Add two test-honesty lint rules and enforce error-only severity in the test config (no `warn`).

- **`vitest/prefer-called-with` (error)** — a bare `toHaveBeenCalled()`/`toBeCalled()` proves a function ran but asserts nothing about arguments or count; require the `*With` form. Exempts the `.not` form.
- **`no-restricted-imports` in test/story files (error)** — consumer test, story, and harness files may not import a server-only (`*.server`) or internal (`**/internals/**`) module; reach the behavior through the public interface instead. A dedicated `*.server.test.*` file is exempt (the right place to import a `.server` module). Covers static `import` / `export … from` only, not dynamic `import()`.
- **`playwright/expect-expect` promoted `warn` → `error`** — a Playwright test that asserts nothing is a false green. Custom `expect*()` helpers still count via `assertFunctionPatterns`.

Consumers on `--max-warnings=0` already treated the prior `warn` as blocking, so this only makes the intent explicit. Expect new errors on bare `toHaveBeenCalled()` and on server/internal imports from consumer tests — treat them as signal.
