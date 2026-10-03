/**
 * Config-level proof that `cn-conditional/cn-conditional` is active through the
 * real composed bundle, in source, story, test, and Playwright files.
 *
 * The bundle is composed from `gaiaLint()` the way
 * `examples/consumer-eslint.config.mjs` does, minus `betterTailwind` (it needs
 * a CSS entry point) and `ignores`. The bundle's typescript-eslint block sets
 * `parserOptions.projectService: true`, and this repo's tsconfig covers only
 * `src/**`, so linting text at `app/...` paths would return one fatal "not
 * found by the project service" parse error and no rule messages. The last
 * config block switches type-aware parsing off. Every path asserts zero fatal
 * messages before any count is read, so a parse failure fails the test instead
 * of passing a zero-count case.
 */
import {ESLint, type Linter} from 'eslint';
import tseslint from 'typescript-eslint';
import {describe, expect, it} from 'vitest';
import gaiaLint from '../index.js';

const RULE_ID = 'cn-conditional/cn-conditional';

const lint = gaiaLint();

const composed: Linter.Config[] = [
  ...lint.base,
  ...lint.react,
  ...lint.reactRouter,
  ...lint.testing,
  ...lint.storybook,
  ...lint.playwright,
  ...lint.styleHygiene,
  ...lint.guardrails,
  ...lint.prettier,
  // Last: type-aware parsing off, so `lintText` works on paths that exist in no
  // tsconfig. `disableTypeChecked` turns off exactly the typescript-eslint rules
  // that need type information; nothing else is dropped.
  tseslint.configs.disableTypeChecked as Linter.Config,
  {languageOptions: {parserOptions: {project: null, projectService: false}}},
];

const eslint = new ESLint({overrideConfig: composed, overrideConfigFile: true});

const FILE_PATHS = [
  'app/components/Fixture/index.tsx',
  'app/components/Fixture/tests/index.stories.tsx',
  'app/components/Fixture/tests/index.test.tsx',
  '.playwright/fixture.spec.ts',
];

const IMPORT = "import {cn} from 'cn';";

const countRule = async (code: string, filePath: string): Promise<number> => {
  const [result] = await eslint.lintText(`${IMPORT} ${code}`, {filePath});
  const fatal = result.messages.filter((message) => message.fatal === true);
  expect(fatal, `fatal parse messages at ${filePath}`).toEqual([]);
  return result.messages.filter((message) => message.ruleId === RULE_ID).length;
};

describe.each(FILE_PATHS)('cn-conditional through the bundle at %s', (filePath) => {
  it('reports an object conditional once', async () => {
    expect(await countRule("cn('a', {b: c});", filePath)).toBe(1);
  });

  it('reports an && conditional once', async () => {
    expect(await countRule("cn('a', c && 'b');", filePath)).toBe(1);
  });

  it('allows the ternary form', async () => {
    expect(await countRule("cn('a', c ? 'b' : undefined);", filePath)).toBe(0);
  });
});
