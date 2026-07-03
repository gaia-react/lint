/**
 * RuleTester suite for the `no-zod-enum` rule.
 *
 * `z.enum([...])` parses under default espree: the rule only inspects
 * CallExpression / MemberExpression / Identifier nodes, so no TS parser is
 * needed. The rule is report-only (no autofix), so no `output` is asserted.
 */
import {RuleTester} from 'eslint';
import {describe, it} from 'vitest';
import noZodEnumPlugin from './no-zod-enum.js';

// Route RuleTester's case registration through vitest for per-case reporting.
RuleTester.describe = describe;
RuleTester.it = it;

const noZodEnumRule = noZodEnumPlugin.rules!['no-zod-enum'];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});

ruleTester.run('no-zod-enum', noZodEnumRule, {
  // --- VALID: must NOT be flagged ---
  valid: [
    // 1. The prescribed replacement.
    "const schema = z.literal(['a', 'b']);",
    // 2. Any other z.* method is untouched.
    'const schema = z.string();',
    // 3. Property access (not a call) on a non-z object.
    'const value = Color.enum;',
    // 4. `.enum()` on a different namespace: not the z convention.
    "const schema = other.enum(['a', 'b']);",
    // 5. Computed access `z['enum'](...)`: documented out of scope (property is
    //    a Literal, not an Identifier named `enum`).
    "const schema = z['enum'](['a', 'b']);",
  ],

  // --- INVALID: must be flagged ---
  invalid: [
    // 6. The canonical violation: an inline string-union enum.
    {
      code: "const schema = z.enum(['a', 'b']);",
      errors: [{messageId: 'noZodEnum'}],
    },
    // 7. z.enum over a referenced const is still flagged.
    {
      code: 'const schema = z.enum(Colors);',
      errors: [{messageId: 'noZodEnum'}],
    },
  ],
});
