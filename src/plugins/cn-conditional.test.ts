/**
 * RuleTester suite for the `cn-conditional` rule.
 *
 * Only a call to the named import `cn` from `'cn'` is checked, so every
 * fixture starts with that import unless it is testing the import condition.
 */
import {RuleTester} from 'eslint';
import {describe, it} from 'vitest';
import cnConditionalPlugin from './cn-conditional.js';

RuleTester.describe = describe;
RuleTester.it = it;

const cnConditionalRule = cnConditionalPlugin.rules!['cn-conditional'];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
});

const IMPORT = "import {cn} from 'cn';";
const withImport = (call: string): string => `${IMPORT} ${call}`;
const invalid = (call: string, count = 1) => ({
  code: withImport(call),
  errors: Array.from({length: count}, () => ({messageId: 'useTernary'})),
});

ruleTester.run('cn-conditional', cnConditionalRule, {
  invalid: [
    invalid("cn('a', {b: c});"),
    invalid("cn('a', [x, {b: c}]);"),
    invalid("cn('a', [[{b: c}]]);"),
    invalid("cn('a', c && 'b');"),
    invalid("cn('a', c || 'b');"),
    invalid("cn('a', c ?? 'b');"),
    invalid("cn('a', c ? d && 'b' : undefined);"),
    invalid("cn('a', c ? undefined : {b: d});"),
    // One report on the outer node, not two.
    invalid("cn('a', c && {b: d});"),
    invalid("cn('a', [c ? [d && 'x'] : undefined]);"),
    // Two offending arguments in one call.
    invalid("cn('a', c && 'b', {d: e});", 2),
    {
      code: "import {cn as cx} from 'cn'; cx('a', c && 'b');",
      errors: [{messageId: 'useTernary'}],
    },
  ],
  valid: [
    withImport("cn('a', c ? 'b' : undefined);"),
    withImport("cn('a', c && d ? 'b' : undefined);"),
    withImport("cn('a', [x, y]);"),
    withImport("cn('a', className);"),
    withImport("cn('a', VARIANTS[v]);"),
    withImport("cn('a', c ? undefined : 'b');"),
    // No import: not the `cn` package.
    "const cn = (...parts) => parts.join(' '); cn('a', {b: c}); cn('a', c && 'b');",
    "cn('a', c && 'b');",
    // Imported from elsewhere.
    "import {cn} from '~/utils/cn'; cn('a', c && 'b');",
    // Shadowed by a parameter.
    "import {cn} from 'cn'; const f = (cn) => cn('a', c && 'b');",
    // Spread and template literal are outside the rule.
    withImport("cn('a', ...rest, `x-${y}`);"),
    "import {twMerge} from 'tailwind-merge'; twMerge('a', c && 'b');",
    // Namespace import is a deliberate miss.
    "import * as c from 'cn'; c.cn('a', d && 'b');",
  ],
});
