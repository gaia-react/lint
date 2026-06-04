import vitest from '@vitest/eslint-plugin';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
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
      // A bare .toThrow() passes on ANY throw, masking the wrong error;
      // require an asserted message or matcher.
      'vitest/require-to-throw-message': 'error',
    },
  },
  {
    ...testingLibrary.configs['flat/react'],
    files: ['**/*.test.ts?(x)'],
    name: 'testing-library',
  },
];
