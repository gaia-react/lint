---
"@gaia-react/lint": minor
---

Harden the `testing` config with test-discipline rules beyond the
`@vitest/eslint-plugin` `recommended` preset (all verified against plugin
v1.6.19). These complement a mechanical TDD RED-verification gate by closing
test-integrity gaps the gate cannot see on its own.

Added (error):

- `consistent-test-it` `{fn: 'test'}` — forbid mixing `test()`/`it()`; GAIA
  uses `test()` exclusively. `fn` cascades to within-describe in 1.6.19.
- `consistent-vitest-vi` `{fn: 'vi'}` — forbid mixing the `vitest`/`vi` mock
  API; GAIA uses `vi`.
- `no-test-return-statement` — a returned value/promise can resolve after the
  test "passes", faking GREEN.
- `no-conditional-in-test` — a branch in a test body can assert nothing on one
  path. (Only this one; `no-conditional-tests` is a byte-identical duplicate.)
- `no-test-prefixes` — forbid `fdescribe`/`fit`/`xdescribe`/`xit`, which bypass
  the active `no-focused-tests` / `no-disabled-tests` rules.
- `prefer-todo` — push empty `test('...')` stubs to `test.todo('...')` so
  unimplemented tests are explicit, not silently passing. (Not `warn-todo`,
  which contradicts it.)
- `require-to-throw-message` — a bare `.toThrow()` passes on any throw; require
  an asserted message or matcher.

Changed (baseline bump):

- `no-disabled-tests` `warn` -> `error` — `.skip` is the biggest gaming vector
  for a RED-verification gate. Park work with `test.todo` or an inline
  `eslint-disable`, not a silent `.skip`.

Downstream impact: these are `error`-level, so projects with existing
violations may see new lint failures. Most additions are auto-fixable
(`eslint --fix`); `no-disabled-tests` and `require-to-throw-message` are not.
Verified zero spurious fires across GAIA's 44 test/story files.
