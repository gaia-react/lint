import {includeIgnoreFile} from '@eslint/config-helpers';
import type {Linter} from 'eslint';
import fs from 'node:fs';
import path from 'node:path';

export type GaiaLintIgnoresOptions = {
  /**
   * Path to a `.gitignore` file to merge in. Resolved from `process.cwd()`
   * if relative. Pass `false` to skip the gitignore merge entirely.
   *
   * If the resolved path does not exist, the merge is silently skipped —
   * projects without a `.gitignore` don't need to opt out explicitly.
   *
   * @default '.gitignore'
   */
  gitignore?: string | false;
  /** Extra ignore globs to merge with GAIA defaults. */
  extra?: string[];
};

/**
 * GAIA's default ignore globs — matches the static `ignored-files` block in
 * GAIA's `eslint.config.mjs`. Consumer's `extra` ignores get concatenated
 * onto this list.
 *
 * Every entry names generated output, a non-source asset, or a tool-owned
 * script directory. Authored source stays out: a bare directory entry here is
 * a GLOBAL ignore, which beats any later block's `files`, so ignoring a
 * directory that another block scopes itself to silently kills that block.
 * `.playwright` and `.storybook` hold hand-written source that the
 * `playwright` and `storybook` blocks exist to lint.
 */
const defaultIgnores = [
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

  const gitignore = opts?.gitignore ?? '.gitignore';
  if (gitignore !== false) {
    const resolved = path.isAbsolute(gitignore)
      ? gitignore
      : path.resolve(process.cwd(), gitignore);
    if (fs.existsSync(resolved)) {
      out.push(includeIgnoreFile(resolved) as Linter.Config);
    }
  }

  out.push({
    ignores: [...defaultIgnores, ...(opts?.extra ?? [])],
    name: 'ignored-files',
  });

  return out;
};
