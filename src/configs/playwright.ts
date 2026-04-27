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
  },
];
