/**
 * Lint-a-string suite for the `no-restricted-imports` composition.
 *
 * `no-restricted-imports` is applied via config (not a custom plugin), and the
 * risk is the flat-config composition, not a single rule's AST logic. So this
 * lints real snippets against the ACTUAL exported config blocks — extracted by
 * name from `buildBase()` and `testing` — rather than a hand-copied rule.
 *
 * Plain `import`/`export ... from` statements parse under espree, so no TS
 * parser is wired up; the blocks are scoped to `.ts`/`.test.ts` filenames, so
 * every snippet is linted with a matching virtual filename.
 */
import {Linter} from 'eslint';
import {describe, expect, test} from 'vitest';
import {buildBase} from './base.js';
import {testing} from './testing.js';

const linter = new Linter();

const findBlock = (
  configs: Linter.Config[],
  name: string,
): Linter.Config => {
  const block = configs.find((config) => config.name === name);
  if (!block) {
    throw new Error(`config block "${name}" not found`);
  }
  return block;
};

const baseConformBlock = findBlock(buildBase('app'), 'gaia/no-restricted-imports');
const testingBlock = findBlock(
  testing,
  'gaia-test-honesty/no-server-import-from-consumer',
);

const lint = (
  code: string,
  block: Linter.Config,
  filename: string,
): Linter.LintMessage[] =>
  linter.verify(
    code,
    [{languageOptions: {ecmaVersion: 'latest', sourceType: 'module'}}, block],
    filename,
  );

describe('base global no-restricted-imports (@conform-to/zod ban)', () => {
  test('bare @conform-to/zod import errors, pointing at /v4', () => {
    const messages = lint(
      "import {parseWithZod} from '@conform-to/zod';",
      baseConformBlock,
      'app/form.ts',
    );
    expect(messages).toHaveLength(1);
    expect(messages[0].ruleId).toBe('no-restricted-imports');
    expect(messages[0].message).toContain('@conform-to/zod/v4');
  });

  test('@conform-to/zod/v4 import is allowed (exact-match, not glob)', () => {
    const messages = lint(
      "import {parseWithZod} from '@conform-to/zod/v4';",
      baseConformBlock,
      'app/form.ts',
    );
    expect(messages).toHaveLength(0);
  });
});

describe('testing no-restricted-imports composition', () => {
  test('conform ban survives on a test file (paths not clobbered)', () => {
    const messages = lint(
      "import {parseWithZod} from '@conform-to/zod';",
      testingBlock,
      'app/form.test.ts',
    );
    expect(
      messages.some((message) => message.message.includes('@conform-to/zod/v4')),
    ).toBe(true);
  });

  test('@conform-to/zod/v4 import is allowed on a test file', () => {
    const messages = lint(
      "import {parseWithZod} from '@conform-to/zod/v4';",
      testingBlock,
      'app/form.test.ts',
    );
    expect(messages).toHaveLength(0);
  });

  test('regression: *.server import from a test file still errors', () => {
    const messages = lint(
      "import {getUser} from '../auth.server';",
      testingBlock,
      'app/user.test.ts',
    );
    expect(
      messages.some((message) => message.message.includes('server-only')),
    ).toBe(true);
  });

  test('regression: internals import from a test file still errors', () => {
    const messages = lint(
      "import {thing} from '../internals/thing';",
      testingBlock,
      'app/user.test.ts',
    );
    expect(
      messages.some((message) => message.message.includes('internal')),
    ).toBe(true);
  });
});
