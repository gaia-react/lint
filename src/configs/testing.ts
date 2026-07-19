import vitest from '@vitest/eslint-plugin';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import {RESTRICTED_IMPORT_PATHS} from './restricted-imports.js';
import type {Linter} from 'eslint';

/**
 * Testing flat-config block.
 *
 * Ports `testHarnessConfig` + `testingLibraryConfig` from GAIA's
 * `eslint.config.mjs`. Wires up Vitest, jest-dom, and Testing Library
 * recommended rules across test/story/test-harness files.
 */
export const testing: Linter.Config[] = [
  {
    files: [
      '**/*.test.ts?(x)',
      '**/*.stories.ts?(x)',
      'test/**/*.ts?(x)',
    ],
    name: 'vitest',
    plugins: {
      'jest-dom': jestDom,
      vitest,
    },
    rules: {
      ...jestDom.configs['flat/recommended'].rules,
      ...vitest.configs.recommended.rules,
      'import-x/no-useless-path-segments': [
        'error',
        {noUselessIndex: true},
      ],
      'vitest/expect-expect': [
        'error',
        {assertFunctionNames: ['expect', 'expect*']},
      ],
      // Baseline bump: `recommended` ships no-disabled-tests at `warn`.
      // .skip is the single biggest gaming vector for a RED-verification
      // gate (it makes a failing test stop failing), so GAIA forbids it
      // outright. Park work with test.todo or an inline eslint-disable, not
      // a silent .skip.
      'vitest/no-disabled-tests': 'error',
      // --- Hardening beyond the `recommended` preset ---------------------
      // Rule names and options verified against @vitest/eslint-plugin
      // v1.6.19. GAIA policy: every lint rule is `error`, never `warn`.
      //
      // Consistency: GAIA uses test() exclusively (120 vs 0 it() across the
      // gaia codebase). In 1.6.19 the `fn` option cascades to the
      // within-describe keyword, so this also governs test()/it() nested in
      // describe blocks. Auto-fixable.
      'vitest/consistent-test-it': ['error', {fn: 'test'}],
      // Consistency: GAIA uses the `vi` mock API (37 vs 0 `vitest.` across the
      // gaia codebase). Auto-fixable.
      'vitest/consistent-vitest-vi': ['error', {fn: 'vi'}],
      // RED-gate: a branch in a test body can assert nothing on one path.
      // Enable ONLY this one; `no-conditional-tests` is a byte-identical
      // duplicate in 1.6.19 and would double-report.
      'vitest/no-conditional-in-test': 'error',
      // RED-gate: fdescribe/fit/xdescribe/xit bypass the active
      // no-focused-tests / no-disabled-tests rules; forbid the prefix
      // spellings so the focus/skip net stays airtight. Auto-fixable.
      'vitest/no-test-prefixes': 'error',
      // RED-gate: a returned value/promise can resolve after the test
      // "passes", swallowing assertions and faking GREEN.
      'vitest/no-test-return-statement': 'error',
      // RED-gate: empty test('...') stubs pass green and read as coverage;
      // rewrite to test.todo('...') so the gap is explicit. Contradicts
      // `warn-todo`, which stays off. Auto-fixable.
      'vitest/prefer-todo': 'error',
      // Honesty (D-8 / SPEC-006 Rule 3, the cheap-win stand-in for
      // `gaia-test-honesty/no-call-through-only`). A bare
      // `toHaveBeenCalled()`/`toBeCalled()` proves the function ran but
      // asserts nothing about how (arguments) or how many (count) — a
      // call-through that re-proves the framework, not the behavior.
      //
      // SCOPE NOTE: `prefer-called-with` is BROADER than spec Rule 3. The spec
      // rule fires only when a bare `toHaveBeenCalled()` is the SOLE assertion
      // in a test; `prefer-called-with` fires on EVERY bare
      // `toHaveBeenCalled()`/`toBeCalled()` (it exempts only the `.not` form).
      // So this stands in for Rule 3 rather than matching it exactly.
      'vitest/prefer-called-with': 'error',
      // A bare .toThrow() passes on ANY throw, masking the wrong error;
      // require an asserted message or matcher.
      'vitest/require-to-throw-message': 'error',
    },
  },
  {
    // Honesty (D-8 / SPEC-006 Rule 4, the cheap-win stand-in for
    // `gaia-test-honesty/no-server-import-from-consumer`). A consumer test,
    // story, or harness file must not import a server-only (`*.server`) or
    // internal (`/internals/`) module: those are private surface, and
    // reaching into them couples the test to implementation the public
    // interface is meant to hide.
    //
    // Same testing glob as the `vitest` block above. The `*.server.test.*`
    // exemption is the point of Rule 4: a dedicated server-side test IS the
    // right place to import a `.server` module (mirrors the real
    // `app/utils/tests/http.server.test.ts` importing `../http.server`).
    //
    // Implemented with the core `no-restricted-imports` rule (config only, no
    // custom plugin) rather than a dedicated AST rule. Chosen over
    // `import-x/no-restricted-paths` because Rule 4 keys off the import
    // SPECIFIER shape (`*.server`, `/internals/`) plus a per-file filename
    // exemption, not the directory `from`/`target` zones that
    // `no-restricted-paths` models.
    //
    // LIMITATION vs the would-be custom rule: `no-restricted-imports` covers
    // static `import` / `export ... from` only, NOT dynamic
    // `import('./x.server')`. The dynamic case is intentionally out of scope
    // for this cheap-win form; the advisory worthiness audit backstops it.
    //
    // ERROR severity, per spec (Rule 4 is an error rule).
    files: [
      '**/*.test.ts?(x)',
      '**/*.stories.ts?(x)',
      'test/**/*.ts?(x)',
    ],
    ignores: ['**/*.server.test.*'],
    name: 'gaia-test-honesty/no-server-import-from-consumer',
    rules: {
      'no-restricted-imports': [
        'error',
        {
          // `paths` re-declares the global `@conform-to/zod` ban from base.ts.
          // Flat config replaces a rule's options wholesale, so this later
          // block would otherwise drop the conform ban on test/story files.
          // Same shared const as base.ts, to stay DRY.
          paths: RESTRICTED_IMPORT_PATHS,
          patterns: [
            {
              group: ['**/*.server'],
              message:
                "Do not import a server-only ('*.server') module from a consumer test. Server-only modules are private surface: reach them through the public interface, or from a dedicated *.server.test.* file (which is exempt from this rule).",
            },
            {
              group: ['**/internals/**', '**/internals'],
              message:
                "Do not import an internal ('/internals/') module from a consumer test. Internal modules are private surface: importing them couples the test to implementation the public interface is meant to hide. Reach the behavior through the public interface instead.",
            },
          ],
        },
      ],
    },
  },
  {
    ...testingLibrary.configs['flat/react'],
    files: ['**/*.test.ts?(x)'],
    name: 'testing-library',
  },
];
