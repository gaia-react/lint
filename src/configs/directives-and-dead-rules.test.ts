/**
 * Unused disable directives fail a plain `eslint` run at error severity, and
 * the two unicorn rules that cannot report under the TypeScript parser are
 * stated off rather than left on as phantom coverage.
 */
import {ESLint, type Linter} from 'eslint';
import tseslint from 'typescript-eslint';
import {describe, expect, it} from 'vitest';
import gaiaLint from '../index.js';

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
  tseslint.configs.disableTypeChecked as Linter.Config,
  {languageOptions: {parserOptions: {project: null, projectService: false}}},
];

const eslint = new ESLint({overrideConfig: composed, overrideConfigFile: true});

const FILE_PATH = 'app/utils/probe.ts';

describe('unused disable directives', () => {
  it('reports an unused eslint-disable directive as an error', async () => {
    const [result] = await eslint.lintText(
      '// eslint-disable-next-line no-console\nexport const value = 1;\n',
      {filePath: FILE_PATH},
    );
    const unused = result.messages.filter((message) =>
      message.message.startsWith('Unused eslint-disable directive'),
    );

    expect(unused).toHaveLength(1);
    expect(unused[0].severity).toBe(2);
  });

  it('does not report a directive that suppresses a real violation', async () => {
    const [result] = await eslint.lintText(
      '// eslint-disable-next-line no-console\nconsole.log(1);\n\nexport const value = 1;\n',
      {filePath: FILE_PATH},
    );
    const [plain] = await eslint.lintText(
      'console.log(1);\n\nexport const value = 1;\n',
      {filePath: FILE_PATH},
    );

    // The directive counts as used only if the line really violates no-console.
    expect(plain.messages.map((message) => message.ruleId)).toContain(
      'no-console',
    );
    expect(
      result.messages.filter((message) =>
        message.message.startsWith('Unused eslint-disable directive'),
      ),
    ).toEqual([]);
  });
});

describe('unicorn rules the TypeScript parser silences', () => {
  it.each(['unicorn/no-blob-to-file', 'unicorn/prefer-set-size'])(
    '%s is off',
    async (ruleId) => {
      const config = (await eslint.calculateConfigForFile(
        FILE_PATH,
      )) as Linter.Config;
      const setting = config.rules?.[ruleId];
      const severity = Array.isArray(setting) ? setting[0] : setting;

      expect(severity).toBe(0);
    },
  );
});
