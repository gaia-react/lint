/**
 * Stylelint config: Tailwind's `@apply` passes the at-rule prelude check,
 * while an invalid prelude on a standard at-rule is still reported.
 */
import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import config from './stylelint.js';

const lintCss = async (code: string): Promise<string[]> => {
  const {results} = await stylelint.lint({code, config});

  return results.flatMap((result) =>
    result.warnings.map((warning) => warning.rule)
  );
};

describe('stylelint config at-rule-prelude-no-invalid', () => {
  it('accepts a Tailwind @apply with variant-prefixed utilities', async () => {
    const rules = await lintCss(
      '.button {\n  @apply bg-white dark:bg-gray-900 focus-visible:ring-2;\n}\n'
    );

    expect(rules).not.toContain('at-rule-prelude-no-invalid');
  });

  it('still reports an invalid prelude on a standard at-rule', async () => {
    const rules = await lintCss('@supports foo {\n  a {\n    color: red;\n  }\n}\n');

    expect(rules).toContain('at-rule-prelude-no-invalid');
  });
});
