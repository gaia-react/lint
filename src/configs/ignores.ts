import {includeIgnoreFile} from '@eslint/compat';
import path from 'node:path';
import type {Linter} from 'eslint';

export type GaiaLintIgnoresOptions = {
  /** Path to a `.gitignore` file to merge in. Resolved from `process.cwd()` if relative. */
  gitignore?: string;
  /** Extra ignore globs to merge with GAIA defaults. */
  extra?: string[];
};

/**
 * GAIA's default ignore globs — matches the static `ignored-files` block in
 * GAIA's `eslint.config.mjs`. Consumer's `extra` ignores get concatenated
 * onto this list.
 */
const defaultIgnores = [
  '.storybook',
  '.playwright',
  '/.react-router/**',
  '.claude/**/*.js',
  '.claude/**/*.cjs',
  'scripts',
  'public/**',
  '**/*.css',
  '**/*.svg',
  '**/*.md',
];

/**
 * Ignores flat-config factory.
 *
 * Ports the `includeIgnoreFile(gitignorePath)` + static `ignored-files`
 * block from GAIA's `eslint.config.mjs`. The `gitignore` path must be
 * resolved at the consumer's cwd (config-load time), not at gaia-lint's
 * install location, so this is shipped as a factory.
 */
export const ignores = (opts?: GaiaLintIgnoresOptions): Linter.Config[] => {
  const out: Linter.Config[] = [];

  if (opts?.gitignore) {
    const resolved = path.isAbsolute(opts.gitignore)
      ? opts.gitignore
      : path.resolve(process.cwd(), opts.gitignore);
    out.push(includeIgnoreFile(resolved) as Linter.Config);
  }

  out.push({
    ignores: [...defaultIgnores, ...(opts?.extra ?? [])],
    name: 'ignored-files',
  });

  return out;
};
