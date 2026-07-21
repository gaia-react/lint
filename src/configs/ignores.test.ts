/**
 * Ignore-shadowing suite for the `ignores` factory.
 *
 * A bare directory entry in the defaults is a GLOBAL ignore, and a global
 * ignore wins over any later block's `files`. Ignoring `.playwright` would
 * therefore silence the `playwright` block that scopes itself to
 * `.playwright/**`, leaving a composed config that reads as covering a
 * directory it never lints. The risk is that shadowing, not any one glob, so
 * this asks ESLint itself which paths survive the defaults.
 *
 * The catch-all `files` block is load-bearing: flat config treats a file
 * matched by no configuration as ignored, so without it every path answers
 * `true` and the suite proves nothing.
 */
import {ESLint} from 'eslint';
import {describe, expect, test} from 'vitest';
import {ignores} from './ignores.js';

const eslint = new ESLint({
  overrideConfig: [
    ...ignores({gitignore: false}),
    {files: ['**/*.{ts,tsx,js,jsx,css,md,svg}']},
  ],
  overrideConfigFile: true,
});

describe('ignores', () => {
  test.each([
    '.playwright/utils.ts',
    '.playwright/e2e/home.spec.ts',
    '.storybook/main.ts',
    '.storybook/decorators/WrapDecorator.tsx',
    'app/root.tsx',
  ])('lints %s', async (file) => {
    expect(await eslint.isPathIgnored(file)).toBe(false);
  });

  test.each([
    '/.react-router/types/routes.ts',
    '.claude/hooks/session-start.js',
    'scripts/release.ts',
    'public/entry.js',
    'app/styles/tailwind.css',
    'README.md',
  ])('ignores %s', async (file) => {
    expect(await eslint.isPathIgnored(file)).toBe(true);
  });

  test('merges extra globs with the defaults', async () => {
    const scoped = new ESLint({
      overrideConfig: [
        ...ignores({extra: ['.gaia/**'], gitignore: false}),
        {files: ['**/*.{ts,tsx,js,jsx}']},
      ],
      overrideConfigFile: true,
    });

    expect(await scoped.isPathIgnored('.gaia/cli/src/index.ts')).toBe(true);
    expect(await scoped.isPathIgnored('app/root.tsx')).toBe(false);
  });
});
