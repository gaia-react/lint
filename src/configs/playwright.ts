import playwrightPlugin from 'eslint-plugin-playwright';
import type {Linter} from 'eslint';

/**
 * Playwright flat-config block.
 *
 * Ports `playwrightConfig` from GAIA's `eslint.config.mjs` — scopes
 * `eslint-plugin-playwright`'s `flat/recommended` config to `.playwright/`
 * test files (GAIA's e2e directory convention).
 */
export const playwright: Linter.Config[] = [
  {
    name: 'playwright',
    ...(playwrightPlugin.configs['flat/recommended'] as Linter.Config),
    files: ['.playwright/**/*.ts?(x)'],
    rules: {
      ...playwrightPlugin.configs['flat/recommended'].rules,
      // Every test must assert something. `assertFunctionPatterns` lets custom
      // `expect*()` helpers count as the assertion. Error, never warn: a test
      // that asserts nothing is a false green.
      'playwright/expect-expect': [
        'error',
        {assertFunctionPatterns: ['^expect[A-Z]']},
      ],
      // A bare `test.skip()` is a test switched off at author time and stays
      // flagged at the recommended set's severity. `test.skip(condition, reason)`
      // is a different thing: Playwright's own API for a test that does not
      // apply to the environment it just found (a feature the project did not
      // enable, a browser without the capability). Allow the conditional form.
      'playwright/no-skipped-test': ['warn', {allowConditional: true}],
    },
  },
];
